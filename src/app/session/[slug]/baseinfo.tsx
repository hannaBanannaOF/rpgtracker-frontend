'use client';

import { BaseCharacterSheetInfo } from '@/src/app/character-sheet/[slug]/baseinfo';
import { TRpgKind } from '@/src/shared/enums';
import { Flex, Loader, Title, Divider, SegmentedControl, Switch, LoadingOverlay, Box, Menu, Burger, Modal, Button, Group, InputWrapper } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from 'react';
import { GbSessionInfo, GbSessionSubmenu } from './gbinfo';
import { useTranslations } from 'next-intl';
import { notifications } from '@mantine/notifications';
import { useDisclosure } from '@mantine/hooks';
import { useForm, yupResolver } from '@mantine/form';
import * as yup from 'yup';

type SessionCharacterSheet = {
  id: string;
  description: string;
}

type SessionDetail = {
  slug: string;
  sessionName: string;
  characterSheets: SessionCharacterSheet[];
  dmed: boolean;
  id: number;
  system: TRpgKind;
  inPlay: boolean;
};

type Schedule = {
  dateTime: Date;
}

export function SessionInfo({slug} : {slug: string}) {
    const t = useTranslations("sessions.detail");

    const getSessionDetail = async (slug: string) => {
      return await fetch(`/core/api/sessions/${slug}`).then(response => {
        if (response.redirected) {
          window.location.href = response.url;
        }
        return response.json();
      }).catch(
        err => {
          notifications.show({
            color: 'red',
            message: t('forbidden'),
            position: 'top-right'
          })
          return null;
        }
      ).then(json => {
        return json;
      }) as SessionDetail;
    }
    
    const updateInPlayStatus = async (slug: string) => {
      return await fetch(`/core/api/sessions/${slug}/toggle-in-play`, {
        method: "PUT"
      }).then(response => {
        if (response.redirected) {
          window.location.href = response.url;
        }
        return response.json();
      }).then(json => {
        notifications.show({
          color: 'green',
          message: t(json.inPlay ? 'playing' : 'not_playing'),
          position: 'top-right'
        })
        return json
      }) as SessionDetail;
    }

    const [selectedSheet, setSelectedSheet] = useState('');
    const [date, setDate] = useState(new Date());

    const queryClient = useQueryClient();

    const [opened, { toggle }] = useDisclosure();
    const [modalopened, { open, close }] = useDisclosure(false);

    const {data, isFetching } = useQuery({
      queryKey: ['session-info-basic', slug],
      queryFn: () => getSessionDetail(slug).then(data => {
        if (data.characterSheets.length > 0) {
          setSelectedSheet(data.characterSheets[0].id);
        }
        return data;
      }),
    });

    const updateInPlayMutation = useMutation({
      mutationFn: updateInPlayStatus,
      onSuccess: (newData) => {
        queryClient.setQueryData(['session-info-basic', slug], newData);
      }
    })

    return <>
        {isFetching && !data && <Flex mt="md" justify={"center"}>
          <Loader type="bars"/>  
        </Flex>}
        {data && <Box pos="relative">
          <LoadingOverlay visible={updateInPlayMutation.isPending} />
          {data.dmed && <Flex justify={"end"}>
            <Menu position="bottom-end" withArrow arrowPosition="center" onClose={toggle}>
              <Menu.Target>
                <Burger opened={opened} onClick={toggle}/>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item>
                  <Switch 
                    checked={data.inPlay} 
                    label={t('set_in_play')}
                    labelPosition='left'
                    onChange={() =>updateInPlayMutation.mutate(data.slug)}
                  />
                </Menu.Item>
                <Menu.Item onClick={() => {
                  open();
                  setDate(new Date())
                }}>
                  {t('schedule_session')}
                </Menu.Item>
                {data.system == TRpgKind.ghostbusters && data.inPlay && data.dmed && <>
                  <Menu.Divider />
                  <GbSessionSubmenu slug={data.slug}/>
                </>}
              </Menu.Dropdown>
            </Menu>
          </Flex>}
          <Flex justify={'center'} my="md"><Title order={2}>{data.sessionName}</Title></Flex>
          {data.system == TRpgKind.ghostbusters && <GbSessionInfo slug={data.slug} id={data.id} dmed={data.dmed} inPlay={data.inPlay}/>}
          <Divider mt={"md"}/>
          <Title my={"md"}>{t(data.dmed ? "sheets" : "my_sheet")}</Title>
          <>
            {data.characterSheets.length > 0 && data.dmed && 
              <SegmentedControl fullWidth color={'rpgtracker-teal'} data={data.characterSheets.map((s) => { return {value: s.id, label: s.description}})} onChange={(val) => {
                setSelectedSheet(val);
                queryClient.invalidateQueries({queryKey: ['character-sheet-info-basic', val], exact: true, type: 'all'})
                queryClient.invalidateQueries({queryKey: ['character-sheet-info-gb', val], exact: true, type: 'all'})
              }}/>
            }
            <BaseCharacterSheetInfo slug={selectedSheet} inSession={data.dmed} />
          </>
          <ScheduleSessionModal modalopened={modalopened} close={close} date={date} slug={data.slug} />
        </Box>}
    </>
}

function ScheduleSessionModal({modalopened, date, slug, close}: {modalopened: boolean, date: Date, slug: string, close: ()=>void}) {

  const t = useTranslations("sessions.detail");

  const scheduleSession = async ({slug, schedule}: {slug: String, schedule: Schedule}) => {
    return await fetch(`/core/api/sessions/${slug}/schedule`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      body: JSON.stringify(schedule)
    },).then(response => {
      if (response.redirected) {
        window.location.href = response.url;
      }
      if (response.ok) {
        notifications.show({
          color: 'green',
          message: t('scheduled_session'),
          position: 'top-right'
        })
      } else {
        notifications.show({
          color: 'red',
          message: t('scheduled_session_error'),
          position: 'top-right'
        })
      }
      return null;
    })
  }

  const scheduleSessionMutation = useMutation({
    mutationFn: scheduleSession,
    onSuccess: () => {
      close();
    }
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
  }} centered withCloseButton={false} size={"lg"}>
    <LoadingOverlay visible={scheduleSessionMutation.isPending} />
    <form onSubmit={form.onSubmit((values) => {
      scheduleSessionMutation.mutate({slug: slug, schedule: values as unknown as Schedule});
    })}>
      <DateTimePicker withSeconds label={t('schedule_datetime')} key={form.key('dateTime')} {...form.getInputProps('dateTime')} />
      <Group justify="flex-end" mt="md">
        <Button type={"submit"}>{t('schedule')}</Button>
      </Group>
    </form>
  </Modal>
}