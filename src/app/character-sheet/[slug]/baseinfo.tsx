'use client';

import { Loader } from "@/src/components/loader/loader";
import { PaperCard } from "@/src/components/papercard/papercard";
import { ReactQueryKeys, TRpgKind } from "@/src/shared/enums";
import { useHttpClient } from "@/src/shared/useHttpClient";
import { Box, LoadingOverlay, Text, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { GbCharacterSheetInfo } from "./gbinfo";

export function BaseCharacterSheetInfo({slug, inSession} : {slug: string, inSession: boolean}) {

  const t = useTranslations('sheets.detail');
  const client = useHttpClient();

  const {data, isFetching } = useQuery({
    queryKey: [ReactQueryKeys.Core.characterSheetInfo, slug],
    queryFn: async () => {
      return await client.get(`/core/api/sheets/${slug}`).catch(
        err => {
          notifications.show({
            color: 'red',
            message: t('forbidden'),
            position: 'top-right'
          })
          return null
        }
      ) as BasicCharacterSheetInfo;
    },
  });

  return <>
      <Loader visible={isFetching && !data} />
      {data && <Box pos={"relative"}>
        <LoadingOverlay visible={isFetching} />
        <Title order={3}>{t('basic_info')}</Title>
        <PaperCard my={"md"}>
          <Text>{t('character_name')}: {data.characterName}</Text>
        </PaperCard>
        {data.system == TRpgKind.ghostbusters && <GbCharacterSheetInfo slug={data.slug} played={data.played} />}
      </Box>}
  </>;
}