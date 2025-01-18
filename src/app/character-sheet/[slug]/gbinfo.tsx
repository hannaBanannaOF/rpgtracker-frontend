import { Flex, Grid, Loader, Paper, rem, Slider, Space, Text, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { TbCakeRoll } from "react-icons/tb";

type GbCharacterSheetInfo = {
  brains: number;
  muscle: number;
  moves: number;
  cool: number;
  brainsTalent: string;
  muscleTalent: string;
  movesTalent: string;
  coolTalent: string;
  browniePoints: number
  goal: string;
  residence: string;
  phone: string;
}

const getGbInfo = async (id: number) => {
  return await fetch(`/gb/api/sheet/${id}`).then(response => {
    if (response.redirected) {
      window.location.href = response.url;
    }
    return response.json();
  }).then(json => {
    return json;
  }) as GbCharacterSheetInfo;
}

export function GbCharacterSheetInfo({slug, id} : {slug: string, id: number}) {
  const {data, isFetching } = useQuery({
      queryKey: ['character-sheet-info-gb', slug],
      queryFn: () => getGbInfo(id),
    });

  const t = useTranslations('sheets.detail.gb');

  return <>
      {isFetching && !data && <Flex mt="md" justify={"center"}>
          <Loader type="bars"/>  
      </Flex>}
      {data && <>
        <Grid>
          <Grid.Col span={{ sm: 12, md:6 }}>
          <Title order={3}>{t('personal_info')}</Title>
            <Paper shadow="md" p="md" my="md" styles={{
                root: {
                    backgroundColor: 'var(--mantine-color-default-hover)',
                }
            }}>
                <Text>{t('goal')}: {data.goal}</Text>
                <Text>{t('residence')}: {data.residence}</Text>
                <Text>{t('phone')}: {data.phone}</Text>
            </Paper>
          </Grid.Col>
          <Grid.Col span={{ sm: 12, md:6 }}>
            <Title order={3}>{t('talents')}</Title>
            <Paper shadow="md" p="md" my="md" styles={{
                root: {
                    backgroundColor: 'var(--mantine-color-default-hover)',
                }
            }}>
                <Flex align={"end"}>
                  <Title order={4}>{t('brains')}: {data.brains}</Title>
                  <Space w="md" />
                  <Text size="sm">({data.brainsTalent}: {data.brains+3})</Text>
                </Flex>
                <Flex align={"end"}>
                  <Title order={4}>{t('muscle')}: {data.muscle}</Title>
                  <Space w="md" />
                  <Text size="sm">({data.muscleTalent}: {data.muscle+3})</Text>
                </Flex>
                <Flex align={"end"}>
                  <Title order={4}>{t('moves')}: {data.moves}</Title>
                  <Space w="md" />
                  <Text size="sm">({data.movesTalent}: {data.moves+3})</Text>
                </Flex>
                <Flex align={"end"}>
                  <Title order={4}>{t('cool')}: {data.cool}</Title>
                  <Space w="md" />
                  <Text size="sm">({data.coolTalent}: {data.cool+3})</Text>
                </Flex>
            </Paper>
          </Grid.Col>
        </Grid>
        <Title order={3}>{t("brownie_points")}: {data.browniePoints}</Title>
        <Space h={"sm"}/>
        <Slider
          thumbChildren={<TbCakeRoll size="1rem" />}
          disabled
          value={data.browniePoints}
          thumbSize={26}
          styles={{ thumb: { borderWidth: rem(2), padding: rem(3) } }}
        />
      </>}
  </>;
}