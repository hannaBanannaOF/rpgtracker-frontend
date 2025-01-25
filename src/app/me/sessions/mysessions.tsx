'use client';

import { ReactQueryKeys, TRpgKind } from "@/src/shared/enums";
import { ListTile } from "@/src/components/listtile/listtile";
import { Alert, Title, Text, Box, LoadingOverlay } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useHttpClient } from "@/src/shared/useHttpClient";
import { Loader } from "@/src/components/loader/loader";

export function MySessions() {
  
  const client = useHttpClient();
  const router = useRouter();
  const t = useTranslations('sessions.list');
  const [loading, setLoading] = useState(false);
  
  const {data, isFetching } = useQuery({
    queryKey: [ReactQueryKeys.Core.mySessions],
    queryFn: async () => {
      return await client.get('/core/api/me/sessions') as Session[];
    },
  });

  return <>
    <Title order={2}>{t('title')}</Title>
    <Loader visible={isFetching && !data} />
    {data && data.length > 0 &&
      <Box pos={"relative"}>
        <LoadingOverlay visible={loading} />
        {data.map(s => <ListTile
            key={s.slug}
            title={s.description} 
            icon={TRpgKind.getIcon(s.system)} 
            iconTooltipLabel={TRpgKind.getLabel(s.system)} 
            badgeValue={s.dmed ? "DMed" : undefined}
            onClick={() => {
              setLoading(true);
              router.push(`/session/${s.slug}`);
            }}
          />
        )}
      </Box>
    }
    {!isFetching && data && data.length == 0 && <Alert variant="light" color="red" mt="md">
      <Text size="md">{t('no_data')}</Text>  
    </Alert>}
  </>
  
}