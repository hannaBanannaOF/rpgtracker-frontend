'use client';

import { Box, Flex, Grid, Loader, Paper, Space, Text, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

type Talent = {
    name: string;
    trait: TalentTrait;
    slug: string;
}

enum TalentTrait {
  brains = 'BRAINS',
  muscle = 'MUSCLE',
  moves = "MOVES",
  cool = 'COOL'
}

namespace TalentTrait {
  export function getLabel(trait: TalentTrait) {
    switch (trait) {
      case TalentTrait.brains:
        return 'Brains'
      case TalentTrait.muscle:
        return 'Muscle'
      case TalentTrait.moves:
        return 'Moves'
      case TalentTrait.cool:
        return 'Cool'
      default:
        return '';
    }
  }
}

export const getTalent = async (slug: string) => {
  return await fetch(`/gb/api/talent/${slug}`).then(response => {
    if (response.redirected) {
      window.location.href = response.url;
    }
    return response.json();
  }).then(json => {
    return json;
  }) as Talent;
}

export function TalentDetails({ slug } : { slug: string }) {
  const t = useTranslations('ghostbusters.talents.details');

  const {data, isFetching } = useQuery({
    queryKey: ['gb-talent-details', slug],
    queryFn: () => getTalent(slug),
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
              <Title order={4}>{t('trait')}:</Title>
              <Space w={"xs"} />
              {TalentTrait.getLabel(data.trait)}
            </Flex>
          </Grid.Col>
        </Grid>
      </Paper>
    </Box>}
  </>
}