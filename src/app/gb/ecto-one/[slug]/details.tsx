'use client';

import { DeleteModal } from "@/src/components/deletemodal/deletemodal";
import { Loader } from "@/src/components/loader/loader";
import { PaperCard } from "@/src/components/papercard/papercard";
import { ReactQueryKeys } from "@/src/shared/enums";
import { useHttpClient } from "@/src/shared/useHttpClient";
import { useMenu } from "@/src/shared/useMenu";
import { Box, Button, Divider, Group, List, LoadingOverlay, Stack, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { TbTrash } from "react-icons/tb";
import { AddUpgradeModal } from "../../addupgrademodal";
import { DeleteUpgradeButton } from "../../deleteupgradebutton";
import { EctoOneForm } from "../form";

export function EctoOneDetails({ slug } : { slug: string }) {
  const t = useTranslations('ghostbusters.ecto_one.details');
  const menu = useMenu();
  const router = useRouter();
  const queryClient = useQueryClient();
  const client = useHttpClient();

  const {data, isFetching } = useQuery({
    queryKey: [ReactQueryKeys.Ghostbusters.ectoOneDetail, slug],
    queryFn: async () => {
      return await client.get(`/gb/api/ecto-one/${slug}`) as EctoOne;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (slug: string) => {
      deleteModalHandlers.close();
      return await client.delete(`/gb/api/ecto-one/${slug}`)
    },
    onSuccess: () => {
      notifications.show({
        color: 'green',
        message: t('delete.success'),
        position: 'top-right'
      })
      queryClient.invalidateQueries({queryKey: [ReactQueryKeys.Ghostbusters.ectoOneList]})
      queryClient.removeQueries({queryKey: [ReactQueryKeys.Ghostbusters.ectoOneDetail]})
      router.back();
    },
    onError: () => {
      notifications.show({
        color: 'red',
        message: t('delete.error'),
        position: 'top-right'
      })
    }
  })
  
  const [deleteModalOpened, deleteModalHandlers] = useDisclosure();

  return <>
    <Loader visible={isFetching && !data} />
    {data && <Box pos={"relative"}>
      <LoadingOverlay visible={isFetching || deleteMutation.isPending} />
      {menu && menu.checkPermission('ghostbusters', 'delete') && data.canChange && <Group justify={"end"}>
          <Button leftSection={<TbTrash />} onClick={deleteModalHandlers.open}>
            {t('delete.button')}
          </Button>
        <DeleteModal opened={deleteModalOpened} resourceName={data.name} close={deleteModalHandlers.close} onConfirm={() => {
          deleteMutation.mutate(slug)
        }}/>
      </Group>}
      <PaperCard>
        {menu && (!menu.checkPermission('ghostbusters', 'update') || !data.canChange) && <Group>
          <Stack>
            <Text fw={"bold"}>{t('name')}:</Text>
            <Text fw={"bold"}>{t('description')}:</Text>
            <Text fw={"bold"}>{t('cost')}:</Text>
            <Text fw={"bold"}>{t('seats')}:</Text>
            <Text fw={"bold"}>{t('carryWeight')}:</Text>
          </Stack>
          <Stack>
            <Text>{data.name}</Text>
            <Text>{data.description}</Text>
            <Text>${data.cost.toFixed(2)}</Text>
            <Text>{data.seats}</Text>
            <Text>{data.carryWeight} {t('units', {count: data.carryWeight})}</Text>
          </Stack>
        </Group>}
        {menu && menu.checkPermission('ghostbusters', 'update') && data.canChange && <EctoOneForm 
          onSubmit={(newData?: EctoOne) => {
            if (newData != null) {
              if (newData.slug != data.slug) {
                router.replace(`/gb/ecto-one/${newData.slug}`)
              } else {
                queryClient.setQueryData([ReactQueryKeys.Ghostbusters.ectoOneDetail, slug], newData)
              }
            }
          }} 
          initialData={data} 
        />}
        <Divider my={"md"} />
        <Title order={4}>{t('available_upgrades')}</Title>
        <List withPadding mt={"md"}>
          {data.availableUpgrades && data.availableUpgrades.map((upgrade) => {
            return <List.Item key={upgrade.id}>
              {upgrade.description}
              {menu && menu.checkPermission('ghostbusters', 'update') && data.canChange && <DeleteUpgradeButton 
                resourceName={data.name} 
                upgradeName={upgrade.description} 
                queryKeys={[ReactQueryKeys.Ghostbusters.ectoOneDetail, slug]}
                deleteLink={`/gb/api/ecto-one/${slug}/unlink-upgrade/${upgrade.id}`}
              />}
            </List.Item>
          })}
        </List>
        {menu && menu.checkPermission('ghostbusters', 'update') && data.canChange && <AddUpgradeModal
          queryKey={[ReactQueryKeys.Ghostbusters.ectoOneDetail, slug]} 
          addUpgradeLink={`/gb/api/ecto-one/${slug}/link-upgrade`}
          getAsyncDataAction={() => { return client.get('/gb/api/ecto-one/upgrades') }} 
        />}
      </PaperCard>
    </Box>}
  </>
}