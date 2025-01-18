'use client';

import { Box, Flex, Grid, Loader, Paper, Space, Text, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { ListItem } from "../../types";

type EctoOneUpgrade = {
    name: string;
    description: string; 
    cost: number; 
    slug: string;
}

export const getEctoOneUpgrade = async (slug: string) => {
  return await fetch(`/gb/api/ecto-one/upgrades/${slug}`).then(response => {
    if (response.redirected) {
      window.location.href = response.url;
    }
    return response.json();
  }).then(json => {
    return json;
  }) as EctoOneUpgrade;
}

export function EctoOneUpgradeDetails({ slug } : { slug: string }) {
  const t = useTranslations('ghostbusters.ecto_one_upgrades.details');

  const {data, isFetching } = useQuery({
    queryKey: ['gb-ecto-one-upgrade-details', slug],
    queryFn: () => getEctoOneUpgrade(slug),
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
              <Title order={4}>{t('description')}:</Title>
              <Space w={"xs"} />
              {data.description}
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