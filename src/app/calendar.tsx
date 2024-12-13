'use client'

import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from '@fullcalendar/daygrid'
import { Button, Flex, Loader, Text, Title } from "@mantine/core"
import { TRpgKind } from "@/src/shared/enums";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import "./calendar.css"
import { useRef, useState } from "react";
import { useFormatter, useLocale, useTranslations } from "next-intl";

type NextSession = {
  slug: string;
  name: string;
  system: TRpgKind;
  date: string;
  dmed: boolean;
};

const getCalendar = async (monthQuery: number, yearQuery: number) => {
  return await fetch('/core/api/me/sessions/calendar?' + new URLSearchParams({month: monthQuery.toString(), year: yearQuery.toString()}).toString()).then(response => {
    if (response.redirected) {
      window.location.href = response.url;
    }
    return response.json();
  }).then(json => {
    return json;
  }) as NextSession[];
}

export function Calendar() {  

  const calendarRef = useRef<FullCalendar>(null);

  const t = useTranslations("home.calendar");
  const format = useFormatter();
  const locale = useLocale();

  const queryClient = useQueryClient();

  const [ month, setMonth ] = useState(new Date().getMonth()+1);
  const [ year, setYear ] = useState(new Date().getFullYear());

  const {data, isFetching } = useQuery({
    queryKey: ['my-calendar', month, year],
    queryFn: () => getCalendar(month, year),
  });

  return <>
    <Title order={2}>{t('title')}</Title>
    {isFetching && !data && <Flex mt="md" justify={"center"}>
            <Loader type="bars"/>  
    </Flex>}
    {data && <>
      <Flex justify={'space-between'} my={"md"}>
        <Button onClick={() => {
          calendarRef?.current?.getApi().prev();
          setMonth((calendarRef?.current?.getApi().view?.activeStart?.getMonth() ?? 0)+1);
          setYear(calendarRef?.current?.getApi().view?.activeStart?.getFullYear() ?? 0);
          queryClient.refetchQueries({queryKey: ['my-calendar'], exact: true, type: 'all'})
        }}>
          {t('button_prev')}
        </Button>
        <Text>{format.dateTime(new Date(year, month-1, 1), {month: 'long'})} {year}</Text>
        <Button onClick={() => {
          calendarRef?.current?.getApi().next();
          setMonth((calendarRef?.current?.getApi().view?.activeStart?.getMonth() ?? 0)+1);
          setYear(calendarRef?.current?.getApi().view?.activeStart?.getFullYear() ?? 0);
          queryClient.refetchQueries({queryKey: ['my-calendar'], exact: true, type: 'all'})
        }}>
          {t('button_next')}
        </Button>
      </Flex>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin]} 
        initialView="dayGridMonth"
        showNonCurrentDates={false}
        locale={locale}
        initialDate={new Date(year, month-1, 1)}
        fixedWeekCount={false}
        headerToolbar={false}
        events={data.map((ns) => {
          return {
            id: ns.slug,
            title: ns.name,
            start: ns.date,
            display: 'block',
          }
        })}
      />
    </>}
  </>
}