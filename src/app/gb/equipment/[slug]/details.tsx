'use client';

import { Box, Flex, Grid, Loader, Paper, Space, Text, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { ListItem } from "../../types";

type Equipment = {
    name: string;
    cost: number; 
    weight: number; 
    slug: string;
    availableUpgrades: ListItem[]
}

export const getEquipment = async (slug: string) => {
  return await fetch(`/gb/api/equipment/${slug}`).then(response => {
    if (response.redirected) {
      window.location.href = response.url;
    }
    return response.json();
  }).then(json => {
    return json;
  }) as Equipment;
}

export function EquipmentDetails({ slug } : { slug: string }) {
  const t = useTranslations('ghostbusters.equipment.details');

  const {data, isFetching } = useQuery({
    queryKey: ['gb-equipment-details', slug],
    queryFn: () => getEquipment(slug),
  });

  return <>
    {isFetching && !data && <Flex mt="md" justify={"center"}>
      <Loader type="bars"/>  
    </Flex>}
    {data && <Box pos={"relative"}>
      <Paper shadow="md" p="md" my="md" styles={{
        root: {
            backgroundColor: 'var(--mantine-color-default-hover)',
        }
      }}>
        <Grid>
          <Grid.Col>
            <Flex align={"center"}>
              <Title order={4}>{t('name')}:</Title>
              <Space w={"xs"} />
              {data.name}
            </Flex>
          </Grid.Col>
          <Grid.Col>
            <Flex align={"center"}>
              <Title order={4}>{t('weight')}:</Title>
              <Space w={"xs"} />
              <Text>{data.weight} {t('units')}</Text>
            </Flex>
          </Grid.Col>
          <Grid.Col>
            <Flex align={'center'}>
              <Title order={4}>{t('cost')}:</Title>
              <Space w={"xs"} />
              ${data.cost.toFixed(2)}
            </Flex>
          </Grid.Col>
        </Grid>
      </Paper>
    </Box>}
  </>
}