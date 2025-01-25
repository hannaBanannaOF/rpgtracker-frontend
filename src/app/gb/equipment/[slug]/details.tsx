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
import { EquipmentForm } from "../form";

export function EquipmentDetails({ slug } : { slug: string }) {
  const t = useTranslations('ghostbusters.equipment.details');
  const queryClient = useQueryClient();
  const router = useRouter();
  const client = useHttpClient();
  const menu = useMenu();
  const [deleteModalOpened, deleteModalHandlers] = useDisclosure();

  const {data, isFetching } = useQuery({
    queryKey: [ReactQueryKeys.Ghostbusters.equipmentDetail, slug],
    queryFn: async () => {
      return await client.get(`/gb/api/equipment/${slug}`) as Equipment;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (slug: string) => {
      deleteModalHandlers.close();
      return await client.delete(`/gb/api/equipment/${slug}`)
    },
    onSuccess: () => {
      notifications.show({
        color: 'green',
        message: t('delete.success'),
        position: 'top-right'
      })
      queryClient.invalidateQueries({queryKey: [ReactQueryKeys.Ghostbusters.equipmentList]})
      queryClient.removeQueries({queryKey: [ReactQueryKeys.Ghostbusters.equipmentDetail]})
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

  return <>
    <Loader visible={isFetching && !data} />
    {data && <Box pos={"relative"}>
      <LoadingOverlay visible={deleteMutation.isPending} />
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
            <Text fw={"bold"}>{t('weight')}</Text>
            <Text fw={"bold"}>{t('cost')}:</Text>
            <Text fw={"bold"}>{t('description')}:</Text>
          </Stack>
          <Stack>
            <Text>{data.name}</Text>
            <Text>{data.weight} {t('units', { count: data.weight })}</Text>
            <Text>${data.cost.toFixed(2)}</Text>
            <Text>{data.description}</Text>
          </Stack>
        </Group>}
        {menu && menu.checkPermission('ghostbusters', 'update') && data.canChange && <EquipmentForm 
          onSubmit={(newData?: Equipment) => {
            if (newData != null) {
              if (newData.slug != data.slug) {
                router.replace(`/gb/equipment/${newData.slug}`)
              } else {
                queryClient.setQueryData([ReactQueryKeys.Ghostbusters.equipmentDetail, slug], newData)
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
                queryKeys={[ReactQueryKeys.Ghostbusters.equipmentDetail, slug]}
                deleteLink={`/gb/api/equipment/${slug}/unlink-upgrade/${upgrade.id}`}
              />}
            </List.Item>
          })}
        </List>
        {menu && menu.checkPermission('ghostbusters', 'update') && data.canChange && <AddUpgradeModal
          queryKey={[ReactQueryKeys.Ghostbusters.equipmentDetail, slug]} 
          addUpgradeLink={`/gb/api/equipment/${slug}/link-upgrade`}
          getAsyncDataAction={() => { return client.get('/gb/api/equipment/upgrades') }} 
        />}
      </PaperCard>
    </Box>}
  </>
}