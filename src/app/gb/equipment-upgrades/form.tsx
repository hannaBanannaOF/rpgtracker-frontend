import { ReactQueryKeys } from "@/src/shared/enums";
import { useHttpClient } from "@/src/shared/useHttpClient";
import { Box, Button, Group, LoadingOverlay, NumberInput, Stack, Textarea, TextInput } from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import * as Yup from 'yup';

export function EquipmentUpgradeForm({ onSubmit, initialData }: { onSubmit: (newData?: EquipmentUpgrade) => void, initialData?: EquipmentUpgrade }) {

  const t = useTranslations("ghostbusters.equipment_upgrades.form");
  const queryClient = useQueryClient();
  const client = useHttpClient();

  const saveEquipmentUpgradeMutation = useMutation({
    mutationFn: async ({ data }: { data: EquipmentUpgrade }) => {
      let promise = initialData != null ? client.put(`/gb/api/equipment/upgrades/${initialData.slug!}`, data) : client.post(`/gb/api/equipment/upgrades`, data);
      return await promise as EquipmentUpgrade | undefined
    },
    onSuccess: (data) => {
      notifications.show({
        color: 'green',
        message: t('notifications.success'),
        position: 'top-right'
      })
      queryClient.invalidateQueries({queryKey: [ReactQueryKeys.Ghostbusters.equipmentUpgradesList]})
      onSubmit(data);
    },
    onError: () => {
      notifications.show({
        color: 'red',
        message: t('notifications.error'),
        position: 'top-right'
      })
    }
  })

  const schema = Yup.object().shape({
    name: Yup.string().required(t('name.required')),
    cost: Yup.number().typeError(t('cost.must_be_number')).required(t('cost.required')).min(0.01, t('cost.min_value')),
    description: Yup.string().required(t('description.required'))
  });

  const form = useForm({
    mode: 'controlled',
    initialValues: initialData ?? {
      name: "",
      cost: 0.00,
      description: ""
    },
    validate: yupResolver(schema)
  })

  return <Box pos={"relative"}>
    <LoadingOverlay visible={saveEquipmentUpgradeMutation.isPending} />
    <form onSubmit={
      form.onSubmit(values => {
        return saveEquipmentUpgradeMutation.mutate({data: values});
      })
    }>
      <Stack>
        <TextInput label={t('name.label')} key={form.key('name')} {...form.getInputProps('name')} />
        <NumberInput label={t('cost.label')} prefix="$ " decimalScale={2} fixedDecimalScale key={form.key('cost')} {...form.getInputProps('cost')} />
        <Textarea label={t('description.label')} key={form.key('description')} {...form.getInputProps('description')} />
        <Group justify="flex-end" mt="md">
          <Button type={"submit"}>{t('submit')}</Button>
        </Group>
      </Stack>
    </form>
  </Box>
}