'use client';

import { TRpgKind } from "@/src/shared/enums";
import { ListTile } from "@/src/components/listtile/listtile";
import { Alert, Flex, Loader, Text, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";

type NextSession = {
  slug: string;
  name: string;
  system: TRpgKind;
  date: string;
  dmed: boolean;
};

const getNextSession = async () => {
  return await fetch('/core/api/me/sessions/next').then(response => {
    if (response.redirected) {
      window.location.href = response.url;
    }
    return response.json();
  }).then(json => {
    return json;
  }) as NextSession;
}

export function NextSession() {
  const t = useTranslations('home.next_session');
  const format = useFormatter();
  const router = useRouter();
  const {data, isFetching } = useQuery({
    queryKey: ['next-session'],
    queryFn: () => getNextSession(),
  });

  return <>
    <Title order={2}>{t('title')}</Title>
    {isFetching && !data && <Flex mt="md" justify={"center"}>
      <Loader type="bars"/>  
    </Flex>}
    {data && <ListTile 
      title={data.name} 
      icon={TRpgKind.getIcon(data.system)} 
      iconTooltipLabel={TRpgKind.getLabel(data.system)} 
      subTitle={format.dateTime(new Date(data.date), 'long')}
      badgeValue={data.dmed ? "DMed" : undefined}
      onClick={() => router.push(`/session/${data.slug}`)}
    />}
    {!isFetching && !data && <Alert variant="light" color="red" mt="md">
      <Text size="md">Não existem próximas sessões com data definida</Text>  
    </Alert>}
  </>
}