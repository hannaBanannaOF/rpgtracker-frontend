import { useHttpClient } from "@/src/shared/useHttpClient";
import { ActionIcon, Alert, Button, Group, LoadingOverlay, Modal, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { TbCheck, TbTrash, TbX } from "react-icons/tb";

export function DeleteUpgradeButton({ resourceName, upgradeName, deleteLink, queryKeys }: { resourceName: string; upgradeName: string; deleteLink: string; queryKeys: string[] }) {

    const queryClient = useQueryClient();
    const client = useHttpClient();
    const t = useTranslations("ghostbusters.delete_upgrade")
    const [opened, { open, close }] = useDisclosure();

    const deleteMutation = useMutation({
      mutationFn: async () => {
        return await client.delete(deleteLink)
      },
      onSuccess: () => {
        notifications.show({
          color: 'green',
          message: t('delete.success'),
          position: 'top-right'
        })
        queryClient.invalidateQueries({queryKey: queryKeys})
        close();
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
      <ActionIcon ms={"md"} onClick={open}>
        <TbTrash />  
      </ActionIcon>
      <Modal opened={opened} onClose={close} centered withCloseButton={false} size={"lg"}>
        <LoadingOverlay visible={deleteMutation.isPending} />
        <Title order={4}>{t('title')}</Title>
        <Text mt={"md"}>{t('unlink_confirm', {resource: resourceName, upgrade: upgradeName})}</Text>
        <Alert variant="light" color="red" mt="md">
          <Text size="sm">{t('this_action_cant_be_undone')}</Text>  
        </Alert>
        <Group justify={"space-around"} mt={"md"}>
          <Button color="red" leftSection={<TbX />} onClick={close}>{t('cancel')}</Button>
          <Button variant="outline" leftSection={<TbCheck />} onClick={() => {
            deleteMutation.mutate();
          }}>{t('confirm')}</Button>
        </Group>
      </Modal>
    </>
}