'use client'

import { ReactQueryKeys, TRpgKind } from "@/src/shared/enums";
import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/react";
import { Box, Button, Collapse, Group, LoadingOverlay, Modal, Stack, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Loader } from "../components/loader/loader";
import { useHttpClient } from "../shared/useHttpClient";
import "./calendar.css";

export function Calendar({ setLoadingHomeAction } : { setLoadingHomeAction: (state: boolean) => void }) {  

  const client = useHttpClient();
  const calendarRef = useRef<FullCalendar>(null);
  const t = useTranslations("home.calendar");
  const format = useFormatter();
  const locale = useLocale();
  const queryClient = useQueryClient();
  const [ month, setMonth ] = useState(new Date().getMonth()+1);
  const [ year, setYear ] = useState(new Date().getFullYear());
  const [ modalOpened, modalHandlers ] = useDisclosure();
  const [ collapseOpened, collapseHandlers ] = useDisclosure();
  const [ nextSession, setNextSession ] = useState<NextSession | undefined>(undefined);
  const router = useRouter();

  const {data, isFetching } = useQuery({
    queryKey: [ReactQueryKeys.Core.myCalendar, month, year],
    queryFn: async () => {
      return await client.get('/core/api/me/sessions/calendar?' + new URLSearchParams({month: month.toString(), year: year.toString()}).toString()) as NextSession[];
    },
  });

  const removeScheduleMutation = useMutation({
    mutationFn: async (nextSession: NextSession) => {
      return await client.delete(`/core/api/sessions/${nextSession.slug}/schedule/${nextSession.scheduleId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [ReactQueryKeys.Core.myCalendar, month, year]})
      queryClient.invalidateQueries({queryKey: [ReactQueryKeys.Core.nextSession]})
      notifications.show({
        color: 'green',
        message: t('notifications.delete_schedule.success'),
        position: 'top-right'
      })
    },
    onError: () => {
      notifications.show({
        color: 'red',
        message: t('notifications.delete_schedule.error'),
        position: 'top-right'
      })
    }
  })

  return <>
    <Title order={2}>{t('title')}</Title>
    <Loader visible={isFetching && !data} />
    {data && <Box pos={"relative"}>
      <LoadingOverlay visible={isFetching} />
      <Group justify={'space-between'} my={"md"}>
        <Button onClick={() => {
          calendarRef?.current?.getApi().prev();
          setMonth((calendarRef?.current?.getApi().view?.activeStart?.getMonth() ?? 0)+1);
          setYear(calendarRef?.current?.getApi().view?.activeStart?.getFullYear() ?? 0);
          queryClient.refetchQueries({queryKey: [ReactQueryKeys.Core.myCalendar]})
        }}>
          {t('button_prev')}
        </Button>
        <Text>{format.dateTime(new Date(year, month-1, 1), {month: 'long'}).replace(/^\w/, (c) => c.toUpperCase())} {year}</Text>
        <Button onClick={() => {
          calendarRef?.current?.getApi().next();
          setMonth((calendarRef?.current?.getApi().view?.activeStart?.getMonth() ?? 0)+1);
          setYear(calendarRef?.current?.getApi().view?.activeStart?.getFullYear() ?? 0);
          queryClient.refetchQueries({queryKey: [ReactQueryKeys.Core.myCalendar]})
        }}>
          {t('button_next')}
        </Button>
      </Group>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin]} 
        initialView="dayGridMonth"
        showNonCurrentDates={false}        
        locale={locale}
        initialDate={new Date(year, month-1, 1)}
        headerToolbar={false}
        displayEventTime={false}
        events={data.map((ns) => {
          return {
            id: ns.slug.concat(ns.date.toString()),
            title: ns.name,
            start: ns.date,
            extendedProps: ns
          }
        })}
        eventClick={(info) => {
          setNextSession(info.event.extendedProps as NextSession)
          modalHandlers.open();
        }}
      />
      {nextSession && <Modal opened={modalOpened} onClose={() => {
        collapseHandlers.close();
        modalHandlers.close();
      }} title={t('schedule_details.label')} centered>
        <Stack>
          <Group align="center">
            {TRpgKind.getIcon(nextSession.system)}
            <Text>{nextSession.name} ({TRpgKind.getLabel(nextSession.system)})</Text>
          </Group>
          <Text>{t('schedule_details.date')}: {format.dateTime(new Date(nextSession.date), "long")}</Text>
          <Group grow>
            {nextSession.dmed && <Button disabled={collapseOpened} color="red" onClick={() => {
              collapseHandlers.open();
            }}>{t('schedule_details.delete.label')}</Button>}
            <Button disabled={collapseOpened} onClick={() => {
              setLoadingHomeAction(true);
              router.push(`/session/${nextSession.slug}`);
            }}>{t('schedule_details.view_session')}</Button>
          </Group>
          <Collapse in={collapseOpened}>
            <Stack>
              <Text>{t('schedule_details.delete.confirm_msg')}</Text>
              <Group grow>
                <Button color="red" onClick={() => {
                  collapseHandlers.close();
                }}>{t('schedule_details.delete.cancel')}</Button>
                <Button onClick={() => {
                  collapseHandlers.close();
                  modalHandlers.close();
                  removeScheduleMutation.mutate(nextSession);
                }}>{t('schedule_details.delete.confirm')}</Button>
              </Group>
            </Stack>
          </Collapse>
        </Stack>
      </Modal>}
    </Box>}
  </>
}