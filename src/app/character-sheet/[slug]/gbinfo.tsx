import { Loader } from "@/src/components/loader/loader";
import { PaperCard } from "@/src/components/papercard/papercard";
import { ReactQueryKeys } from "@/src/shared/enums";
import { useHttpClient } from "@/src/shared/useHttpClient";
import { Box, Flex, Group, LoadingOverlay, rem, Slider, Stack, Text, Title } from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { TbCakeRoll } from "react-icons/tb";

export function GbCharacterSheetInfo({slug, played} : {slug: string, played: boolean}) {
 
  const t = useTranslations('sheets.detail.gb');
  const client = useHttpClient();
  const queryClient = useQueryClient();
  const [bp, setBp] = useState(0);

  const {data, isFetching } = useQuery({
    queryKey: [ReactQueryKeys.Ghostbusters.characterSheetInfo, slug],
    queryFn: async () => {
      let data = await client.get(`/gb/api/sheet/${slug}`) as GbCharacterSheetInfo;
      setBp(data.browniePoints);
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({newValues}: { newValues: GbCharacterSheetInfo }) => {
      return await client.put(`/gb/api/sheet/${slug}`, newValues);
    },
    onSuccess(data) {
      queryClient.setQueryData([ReactQueryKeys.Ghostbusters.characterSheetInfo, slug], data)
    }
  })

  return <>
    <Loader visible={isFetching && !data} />
    {data && <Box pos={"relative"}>
      <LoadingOverlay visible={updateMutation.isPending || isFetching} />
      <Stack>
        <Flex direction={{ base: "column", sm: "row" }} gap={"md"}>
          <Stack style={{ flexGrow: 1 }}>
            <Title order={3}>{t('personal_info')}</Title>
            <PaperCard>
              <Text>{t('goal')}: {data.goal}</Text>
              <Text>{t('residence')}: {data.residence}</Text>
              <Text>{t('phone')}: {data.phone}</Text>
            </PaperCard>
          </Stack>
          <Stack style={{ flexGrow: 1 }}>
            <Title order={3}>{t('talents')}</Title>
            <PaperCard>
              <Group align={"end"}>
                <Title order={4}>{t('brains')}: {data.brains}</Title>
                <Text size="sm">({data.brainsTalent}: {data.brains+3})</Text>
              </Group>
              <Group align={"end"}>
                <Title order={4}>{t('muscle')}: {data.muscle}</Title>
                <Text size="sm">({data.muscleTalent}: {data.muscle+3})</Text>
              </Group>
              <Group align={"end"}>
                <Title order={4}>{t('moves')}: {data.moves}</Title>
                <Text size="sm">({data.movesTalent}: {data.moves+3})</Text>
              </Group>
              <Group align={"end"}>
                <Title order={4}>{t('cool')}: {data.cool}</Title>
                <Text size="sm">({data.coolTalent}: {data.cool+3})</Text>
              </Group>
            </PaperCard>
          </Stack>
        </Flex>
        <Stack>
          <Title order={3}>{t("brownie_points")}: {data.browniePoints}</Title>
          <Slider
            thumbChildren={<TbCakeRoll size="1rem" />}
            value={bp}
            onChange={setBp}
            disabled={!played}
            thumbSize={26}
            styles={{ thumb: { borderWidth: rem(2), padding: rem(3) } }}
            onChangeEnd={(value) => {
              updateMutation.mutate({newValues: {...data, browniePoints: value}});
            }}
          />
        </Stack>
      </Stack>  
    </Box>}
  </>;
}