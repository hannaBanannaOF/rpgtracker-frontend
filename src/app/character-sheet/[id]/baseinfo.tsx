'use client';

import { useQuery } from "@tanstack/react-query";
import { Divider, Flex, Loader, Paper, Text, Title } from '@mantine/core';
import { useTranslations } from "next-intl";

type BasicCharacterSheetInfo = {
    slug: string;
    characterName: string;
}

const getBasicInfo = async (slug: string) => {
    return await fetch(`/core/api/sheets/${slug}`).then(response => {
      if (response.redirected) {
        window.location.href = response.url;
      }
      return response.json();
    }).then(json => {
      return json;
    }) as BasicCharacterSheetInfo;
  }

export function BaseCharacterSheetInfo({slug} : {slug: string}) {
    const {data, isFetching } = useQuery({
        queryKey: ['character-sheet-info-basic', slug],
        queryFn: () => getBasicInfo(slug),
      });

    const t = useTranslations('sheets.detail');

    return <>
        {isFetching && !data && <Flex mt="md" justify={"center"}>
        <Loader type="bars"/>  
        </Flex>}
        {data && <>
            <Title order={4}>{t('basic_info')}</Title>
            <Paper shadow="md" p="md" my="md" styles={{
                root: {
                    backgroundColor: 'var(--mantine-color-default-hover)',
                }
            }}>
                <Text>{t('character_name')}: {data.characterName}</Text>
            </Paper>
            <Divider label={<Title order={4}>{t('rpg_info')}</Title>} labelPosition="left"/>
        </>}
    </>;
}