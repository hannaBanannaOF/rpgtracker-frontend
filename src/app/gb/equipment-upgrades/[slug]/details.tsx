'use client';

import { DeleteModal } from "@/src/components/deletemodal/deletemodal";
import { Loader } from "@/src/components/loader/loader";
import { PaperCard } from "@/src/components/papercard/papercard";
import { ReactQueryKeys } from "@/src/shared/enums";
import { useHttpClient } from "@/src/shared/useHttpClient";
import { useMenu } from "@/src/shared/useMenu";
import { Box, Button, Group, LoadingOverlay, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { TbTrash } from "react-icons/tb";
import { EquipmentUpgradeForm } from "../form";

export const deleteEquipmentUpgrade = async (slug: string) => {
  return await fetch(`http://localhost:8081/gb/api/equipment/upgrades/${slug}`, {
    method: "DELETE"
  }).then(response => {
    return response.ok;
  })
}

export function EquipmentUpgradeDetails({ slug } : { slug: string }) {
  const t = useTranslations('ghostbusters.equipment_upgrades.details');
  const client = useHttpClient();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [deleteModalOpened, deleteModalHandlers] = useDisclosure();

  const {data, isFetching } = useQuery({
    queryKey: [ReactQueryKeys.Ghostbusters.equipmentUpgradesDetail, slug],
    queryFn: async () => {
      return await client.get(`/gb/api/equipment/upgrades/${slug}`) as EquipmentUpgrade
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (slug: string) => {
      deleteModalHandlers.close();
      return await client.delete(`/gb/api/equipment/upgrades/${slug}`);
    },
    onSuccess: () => {
      notifications.show({
        color: 'green',
        message: t('delete.success'),
        position: 'top-right'
      })
      queryClient.invalidateQueries({queryKey: [ReactQueryKeys.Ghostbusters.equipmentUpgradesList]})
      queryClient.removeQueries({queryKey: [ReactQueryKeys.Ghostbusters.equipmentUpgradesDetail]})
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

  const menu = useMenu();

  return <>
    <Loader visible={isFetching && !data} />
    {data && <Box pos={"relative"}>
      <LoadingOverlay visible={deleteMutation.isPending} />
      {menu && menu.checkPermission('ghostbusters', 'delete') && data.canChange &&  <Group justify={"end"}>
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
            <Text fw={"bold"}>{t('cost')}:</Text>
            <Text fw={"bold"}>{t('description')}:</Text>
          </Stack>
          <Stack>
            <Text>{data.name}</Text>
            <Text>${data.cost.toFixed(2)}</Text>
            <Text>{data.description}</Text>
          </Stack>
        </Group>}
        {menu && menu.checkPermission('ghostbusters', 'update') && data.canChange && <EquipmentUpgradeForm 
          onSubmit={(newData?: EquipmentUpgrade) => {
            if (newData != null) {
              if (newData.slug != data.slug) {
                router.replace(`/gb/ecto-one-upgrades/${newData.slug}`)
              } else {
                queryClient.setQueryData([ReactQueryKeys.Ghostbusters.equipmentUpgradesDetail, slug], newData)
              }
            }
          }} 
          initialData={data} 
        />}
      </PaperCard>
    </Box>}
  </>
}