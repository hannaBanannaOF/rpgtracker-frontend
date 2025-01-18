'use client';

import { ListTile } from "@/src/components/listtile/listtile";
import { Alert, Box, Flex, Loader, LoadingOverlay, Text, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { ListItem } from "../types";
import { useRouter } from "next/navigation";

export const getItems = async () => {
  return await fetch('/gb/api/equipment').then(response => {
    if (response.redirected) {
      window.location.href = response.url;
    }
    return response.json();
  }).then(json => {
    return json;
  }) as ListItem[];
}

export function EquipmentList() {
  const t = useTranslations('ghostbusters.equipment');
  const router = useRouter();
  const {data, isFetching } = useQuery({
    queryKey: ['gb-equipment-list'],
    queryFn: () => getItems(),
  });

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
            key={s.id}
            title={s.description}
            onClick={() => {
              setLoading(true);
              router.push(`/gb/equipment/${s.id}`);
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