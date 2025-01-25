'use client';

import { ListTile } from "@/src/components/listtile/listtile";
import { ReactQueryKeys, TRpgKind } from "@/src/shared/enums";
import { Alert, Box, LoadingOverlay, Text, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useFormatter, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Loader } from "../components/loader/loader";
import { useHttpClient } from "../shared/useHttpClient";

export function NextSession({ setLoadingHomeAction } : { setLoadingHomeAction: (state: boolean) => void }) {
  
  const client = useHttpClient();
  const t = useTranslations('home.next_session');
  const format = useFormatter();
  const router = useRouter();

  const {data, isFetching } = useQuery({
    queryKey: [ReactQueryKeys.Core.nextSession],
    queryFn: async () => {
      let data = await client.get('/core/api/me/sessions/next') as NextSession;
      if (data == null) {
        return Promise.reject();
      }
      return data;
    },
  });

  return <>
    <Title order={2}>{t('title')}</Title>
    <Loader visible={isFetching && !data} />
    {data && <Box pos={"relative"}>
      <LoadingOverlay visible={isFetching} />
      <ListTile 
        title={data.name} 
        icon={TRpgKind.getIcon(data.system)} 
        iconTooltipLabel={TRpgKind.getLabel(data.system)} 
        subTitle={format.dateTime(new Date(data.date), 'long')}
        badgeValue={data.dmed ? "DMed" : undefined}
        onClick={() => {
          setLoadingHomeAction(true);
          router.push(`/session/${data.slug}`);
        }}
      />
    </Box>}
    {!isFetching && !data && <Alert variant="light" color="red" mt="md">
      <Text size="md">{t('no_data')}</Text>  
    </Alert>}
  </>
}