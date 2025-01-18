'use client';

import { TRpgKind } from "@/src/shared/enums";
import { ListTile } from "@/src/components/listtile/listtile";
import { Alert, Box, Flex, Loader, LoadingOverlay, Skeleton, Text, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";

type Sheet = {
  slug: string;
  description: string;
  system: TRpgKind;
};

const getSheets = async () => {
  return await fetch('/core/api/me/sheets').then(response => {
    if (response.redirected) {
      window.location.href = response.url;
    }
    return response.json();
  }).then(json => {
    return json;
  }) as Sheet[];
}

export function MySheets() {

  const {data, isFetching } = useQuery({
    queryKey: ['my-sheets'],
    queryFn: () => getSheets(),
  });

  const router = useRouter();

  const t = useTranslations('sheets.list');

  const [loading, setLoading] = useState(false);

  return <>
    <Title order={2}>{t('title')}</Title>
    {isFetching && !data && <Flex mt="md" justify={"center"}>
      <Loader type="bars"/>  
    </Flex>}
    {data && data.length > 0 &&
      <Box pos={"relative"}>
        <LoadingOverlay visible={loading} />
        {data.map(s => <ListTile 
          title={s.description} 
          icon={TRpgKind.getIcon(s.system)} 
          iconTooltipLabel={TRpgKind.getLabel(s.system)}
          onClick={() => {
            setLoading(true);
            router.push(`/character-sheet/${s.slug}`);
          }}
          />
        )}
      </Box>
    }
    {!isFetching && data && data.length === 0 && <Alert variant="light" color="red" mt="md">
      <Text size="md">{t('no_data')}</Text>  
    </Alert>}
  </>
}