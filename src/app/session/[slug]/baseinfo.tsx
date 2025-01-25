'use client';

import { BaseCharacterSheetInfo } from '@/src/app/character-sheet/[slug]/baseinfo';
import { Loader } from '@/src/components/loader/loader';
import { ReactQueryKeys, TRpgKind } from '@/src/shared/enums';
import { useHttpClient } from '@/src/shared/useHttpClient';
import { ActionIcon, Box, Button, Group, LoadingOverlay, Modal, SegmentedControl, Stack, Switch, Title, Tooltip } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useForm, yupResolver } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { TbCalendar } from 'react-icons/tb';
import * as yup from 'yup';
import { GbSessionInfo } from './gbinfo';

export function SessionInfo({slug} : {slug: string}) {

  const client = useHttpClient();
  const queryClient = useQueryClient();
  const t = useTranslations("sessions.detail");
  const [selectedSheet, setSelectedSheet] = useState('');
  const [selectedTab, setSelectedTab] = useState<string>("session");
  const [date, setDate] = useState(new Date());
  const [modalopened, { open, close }] = useDisclosure(false);

  const {data, isFetching } = useQuery({
    queryKey: [ReactQueryKeys.Core.sessionInfo, slug],
    queryFn: async () => {
      return await client.get(`/core/api/sessions/${slug}`)
      .then(data => {
        if (data.characterSheets.length > 0) {
          setSelectedSheet(data.characterSheets[0].id);
        }
        return data;
      })
      .catch(
        err => {
          notifications.show({
            color: 'red',
            message: t('forbidden'),
            position: 'top-right'
          })
          return null;
        }
      ) as SessionDetail;
    },
  });

  const updateInPlayMutation = useMutation({
    mutationFn: async (slug: string) => {
      return await client.put(`/core/api/sessions/${slug}/toggle-in-play`).then(data => {
        notifications.show({
          color: 'green',
          message: t(data.inPlay ? 'playing' : 'not_playing'),
          position: 'top-right'
        })
        return data 
      }) as SessionDetail
    },
    onSuccess: (newData) => {
      queryClient.setQueryData([ReactQueryKeys.Core.sessionInfo, slug], newData);
    }
  })

  return <>
      <Loader visible={isFetching && !data} />
      {data && <Box pos="relative">
        <LoadingOverlay visible={isFetching || updateInPlayMutation.isPending} />
        <Stack>
          <Group justify={'center'} mb="md">
            <Title order={2}>{data.sessionName}</Title>
          </Group>
          <SegmentedControl fullWidth color={'rpgtracker-teal'} data={[
            {value: "session", label: t('session')},
            {value: "sheets", label: t(data.dmed ? "sheets" : "my_sheet")}
          ]} onChange={(val) => {
            setSelectedTab(val);
          }}/>
          {selectedTab == "session" && <Stack>
            {data.dmed && <Group justify={'flex-end'}>
              <Switch 
                checked={data.inPlay} 
                label={t('set_in_play')}
                labelPosition='left'
                onChange={() =>updateInPlayMutation.mutate(data.slug)}
              />
              <Tooltip label={t('schedule_session')}>
                <ActionIcon onClick={() => {
                  open();
                  setDate(new Date())
                }} >
                  <TbCalendar />
                </ActionIcon>
              </Tooltip>
              <ScheduleSessionModal modalopened={modalopened} close={close} date={date} slug={data.slug} />
            </Group>}
            {data.system == TRpgKind.ghostbusters && <GbSessionInfo slug={data.slug} dmed={data.dmed} inPlay={data.inPlay}/>}
          </Stack>}
          {selectedTab == "sheets" && <Stack>
            <Title>{t(data.dmed ? "sheets" : "my_sheet")}</Title>
            {data.characterSheets.length > 0 && data.dmed && 
              <SegmentedControl fullWidth color={'rpgtracker-teal'} data={data.characterSheets.map((s) => { return {value: s.id, label: s.description}})} onChange={(val) => {
                setSelectedSheet(val);
                queryClient.invalidateQueries({queryKey: [ReactQueryKeys.Core.characterSheetInfo, val]})
                if (data.system == TRpgKind.ghostbusters) {
                  queryClient.invalidateQueries({queryKey: [ReactQueryKeys.Ghostbusters.characterSheetInfo, val]})
                }
              }}/>
            }
            <BaseCharacterSheetInfo slug={selectedSheet} inSession={data.dmed} />
          </Stack>}
        </Stack>
      </Box>}
  </>
}

function ScheduleSessionModal({modalopened, date, slug, close}: {modalopened: boolean, date: Date, slug: string, close: ()=>void}) {

  const t = useTranslations("sessions.detail");
  const client = useHttpClient();

  const scheduleSessionMutation = useMutation({
    mutationFn: async ({slug, schedule}: {slug: String, schedule: Schedule}) => {
      return await client.post(`/core/api/sessions/${slug}/schedule`, schedule)
    },
    onSuccess: () => {
      notifications.show({
        color: 'green',
        message: t('scheduled_session'),
        position: 'top-right'
      })
      close();
    },
    onError() {
      notifications.show({
        color: 'red',
        message: t('scheduled_session_error'),
        position: 'top-right'
      })
    },
  })

  const schema = yup.object().shape({
    dateTime: yup.date().min(date, t('date_need_to_be_after_today')).required(t('data_cant_be_null'))
  });

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      dateTime: date
    },
    validate: yupResolver(schema),
  });

  return <Modal opened={modalopened} 
  onClose={() => {
    close();
    form.reset();
  }} centered size={"lg"} title={t('schedule_session')} >
    <LoadingOverlay visible={scheduleSessionMutation.isPending} />
    <form onSubmit={form.onSubmit((values) => {
      scheduleSessionMutation.mutate({slug: slug, schedule: values as Schedule});
    })}>
      <DateTimePicker withSeconds label={t('schedule_datetime')} key={form.key('dateTime')} {...form.getInputProps('dateTime')} />
      <Group justify="flex-end" mt="md">
        <Button type={"submit"}>{t('schedule')}</Button>
      </Group>
    </form>
  </Modal>
}