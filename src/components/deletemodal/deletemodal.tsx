import { Alert, Button, Flex, Modal, Text, Title } from "@mantine/core";
import { useTranslations } from "next-intl";
import { TbCancel, TbCheck, TbX } from "react-icons/tb";

export function DeleteModal({ opened, resourceName, close, onConfirm }: { opened: boolean, resourceName: string, close: () => void, onConfirm: () => void }) {

  const t = useTranslations("deleteModal")

  return <Modal opened={opened} onClose={close} centered withCloseButton={false} size={"lg"}>
    <Title order={4}>{t('title')}</Title>
    <Text mt={"md"}>{t('delete_confirm', {resource: resourceName})}</Text>
    <Alert variant="light" color="red" mt="md">
      <Text size="sm">{t('this_action_cant_be_undone')}</Text>  
    </Alert>
    <Flex justify={"space-around"} mt={"md"}>
      <Button color="red" leftSection={<TbX />} onClick={close}>{t('cancel')}</Button>
      <Button variant="outline" leftSection={<TbCheck />} onClick={() => {
        close();
        onConfirm();
      }}>{t('confirm')}</Button>
    </Flex>
  </Modal>
}