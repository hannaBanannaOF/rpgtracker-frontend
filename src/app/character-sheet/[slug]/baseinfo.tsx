'use client';

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Flex, Loader, Paper, Text, Title } from '@mantine/core';
import { useTranslations } from "next-intl";
import { TRpgKind } from "@/src/shared/enums";
import { GbCharacterSheetInfo } from "./gbinfo";
import { notifications } from '@mantine/notifications';

type BasicCharacterSheetInfo = {
    id: number;
    slug: string;
    characterName: string;
    system: TRpgKind;
}

export function BaseCharacterSheetInfo({slug, inSession} : {slug: string, inSession: boolean}) {

  const t = useTranslations('sheets.detail');

  const getBasicInfo = async (slug: string) => {
    return await fetch(`/core/api/sheets/${slug}`).then(response => {
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
        return null
      }
    ).then(json => {
      return json;
    }) as BasicCharacterSheetInfo;
  }

  const {data, isFetching } = useQuery({
    queryKey: ['character-sheet-info-basic', slug],
    queryFn: () => getBasicInfo(slug),
  });

  const queryClient = useQueryClient();
    

    return <>
        {isFetching && !data && <Flex mt="md" justify={"center"}>
        <Loader type="bars"/>  
        </Flex>}
        {data && <>
          {inSession && <Flex mt={"md"} justify={"end"}>
            <Button loading={isFetching} onClick={() => {
                queryClient.invalidateQueries({queryKey: ['character-sheet-info-basic', slug], exact: true, type: 'all'})
                queryClient.invalidateQueries({queryKey: ['character-sheet-info-gb', slug], exact: true, type: 'all'})
              }}>{t('refetch_sheet_data')}
            </Button>
          </Flex>}
          <Title order={3}>{t('basic_info')}</Title>
          <Paper shadow="md" p="md" my="md" styles={{
              root: {
                  backgroundColor: 'var(--mantine-color-default-hover)',
              }
          }}>
              <Text>{t('character_name')}: {data.characterName}</Text>
          </Paper>
          {data.system == TRpgKind.ghostbusters && <GbCharacterSheetInfo slug={data.slug} id={data.id} />}
        </>}
    </>;
}