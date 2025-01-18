import { Badge, Flex, Loader, Menu, SemiCircleProgress, Space, Title } from "@mantine/core";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

type GbSessionInfo = {
  id: number,
  coreId: number,
  headquarters: boolean,
  teamSavings: number,
  containmentGridCapacity: number,
  containmentGridLoad: number
}

const getGbInfo = async (id: number) => {
  return await fetch(`/gb/api/session/${id}`).then(response => {
    if (response.redirected) {
      window.location.href = response.url;
    }
    return response.json();
  }).then(json => {
    return json;
  }) as GbSessionInfo;
}

export function GbSessionInfo({slug, id, dmed, inPlay} : {slug: string, id: number, dmed: boolean, inPlay: boolean}) {
  const {data, isFetching } = useQuery({
    queryKey: ['session-info-gb', slug],
    queryFn: () => getGbInfo(id),
  });

  const t = useTranslations('sessions.detail.gb');

  const getLoadColor = (): string => {
    if (data == null) {
      return "primary"
    }
    let usage = (data.containmentGridLoad*100)/data.containmentGridCapacity;
    return usage < 75 ? "green" : (usage < 90 ? "yellow" : "red");
  }

  return <>
      {isFetching && !data && <Flex mt="md" justify={"center"}>
          <Loader type="bars"/>  
      </Flex>}
      {data && <>
        <Flex justify={"start"}>
          <Badge color={data.headquarters ? "green" : "red"}>{t(data.headquarters ? 'has_headquarters' : 'no_headquarters')}</Badge>
        </Flex>
        <Space h={"md"}/>
        <Flex direction={{ base: "column", md:"row"  }} justify={"space-between"} align={{ base: "stretch", md: "center"}}>
          <Title order={4}>{t('team_savings')}: ${data.teamSavings.toFixed(2)}</Title>
          {data.headquarters && <Flex align={"center"} justify={"space-between"}>
            <Title order={4}>{t('containment_grid_load')}</Title>
            <SemiCircleProgress
              fillDirection="left-to-right"
              orientation="up"
              filledSegmentColor={getLoadColor()}
              size={200}
              thickness={12}
              value={data.containmentGridCapacity > 0 ? (data.containmentGridLoad*100)/data.containmentGridCapacity : 0}
              label={`${(data.containmentGridCapacity > 0 ? (data.containmentGridLoad*100)/data.containmentGridCapacity : 0).toFixed(2)} %`}
            />
          </Flex>}
        </Flex>
      </>}
  </>;
}

export function GbSessionSubmenu({ slug }: { slug: string }) {
  
  const t = useTranslations("sessions.detail.gb")
  const queryClient = useQueryClient();

  const data = queryClient.getQueryData(['session-info-gb', slug]) as GbSessionInfo;

  return <>
    {!data.headquarters && <Menu.Item onClick={() => {
                
    }}>
      {t("enable_hq")}
    </Menu.Item>}
    {data.headquarters && <Menu.Item onClick={() => {
                
    }}>
      {t("disable_hq")}
    </Menu.Item>}
  </>
}
