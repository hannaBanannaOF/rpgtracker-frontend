'use client';

import { TRpgKind } from "@/src/shared/enums";
import { ListTile } from "@/src/components/listtile/listtile";
import { Flex, Loader, Skeleton, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

type Sheet = {
  id: number;
  description: string;
  system: TRpgKind;
};

const getSheets = async () => {
  return await fetch('/core/api/me/sheets', {credentials: "include"}).then(response => {
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

  return <>
    <Title order={2}>{t('title')}</Title>
    {isFetching && !data && <Flex mt="md" justify={"center"}>
      <Loader type="bars"/>  
    </Flex>}
    {data && 
        data.map(s => <ListTile 
            title={s.description} 
            icon={TRpgKind.getIcon(s.system)} 
            iconTooltipLabel={TRpgKind.getLabel(s.system)}
            onClick={() => router.push(`/character-sheet/${s.id}`)}
          />
        )
      }
  </>
}