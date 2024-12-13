'use client';

import { TRpgKind } from "@/src/shared/enums";
import { ListTile } from "@/src/components/listtile/listtile";
import { Flex, Loader, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

type Session = {
  slug: string;
  description: string;
  system: TRpgKind;
  dmed: boolean;
};

export const getSessions = async () => {
  return await fetch('/core/api/me/sessions').then(response => {
    if (response.redirected) {
      window.location.href = response.url;
    }
    return response.json();
  }).then(json => {
    return json;
  }) as Session[];
}

export function MySessions() {

  const router = useRouter();
  const t = useTranslations('sessions.list');

  const {data, isFetching } = useQuery({
    queryKey: ['my-sessions'],
    queryFn: () => getSessions(),
  });

  return <>
    <Title order={2}>{t('title')}</Title>
    {isFetching && !data && <Flex mt="md" justify={"center"}>
      <Loader type="bars"/>  
    </Flex>}
    {data && 
        data.map(s => <ListTile
            key={s.slug}
            title={s.description} 
            icon={TRpgKind.getIcon(s.system)} 
            iconTooltipLabel={TRpgKind.getLabel(s.system)} 
            badgeValue={s.dmed ? "DMed" : undefined}
            onClick={() => router.push(`/session/${s.slug}`)}
          />
        )
      }
  </>
  
}