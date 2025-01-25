import { ReactQueryKeys } from "@/src/shared/enums";
import { useHttpClient } from "@/src/shared/useHttpClient";
import { Box, Button, Flex, Group, LoadingOverlay, NumberInput, Stack, Textarea, TextInput } from '@mantine/core';
import { useForm, yupResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import * as Yup from 'yup';

export function EquipmentForm({ onSubmit, initialData }: { onSubmit: (newData?: Equipment) => void, initialData?: Equipment }) {

  const t = useTranslations("ghostbusters.equipment.form");
  const queryClient = useQueryClient();
  const client = useHttpClient();

  const saveEquipmentMutation = useMutation({
    mutationFn: async ({ data }: { data: Equipment }) => {
      let promise = initialData != null ? client.put(`/gb/api/equipment/${initialData.slug!}`, data) : client.post('/gb/api/equipment', data)
      return await promise as Equipment | undefined
    },
    onSuccess: (data) => {
      notifications.show({
        color: 'green',
        message: t('notifications.success'),
        position: 'top-right'
      })
      queryClient.invalidateQueries({queryKey: [ReactQueryKeys.Ghostbusters.equipmentList]})
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
    weight: Yup.number().typeError(t('weight.must_be_number')).required(t('weight.required')).min(1, t('weight.min_value')),
    description: Yup.string().required(t('description.required'))
  });

  const form = useForm({
    mode: 'controlled',
    initialValues: initialData ?? {
      name: "",
      cost: 0.00,
      weight: 0,
      seats: 0,
      description: ""
    },
    validate: yupResolver(schema)
  })

  return <Box pos={"relative"}>
    <LoadingOverlay visible={saveEquipmentMutation.isPending} />
    <form onSubmit={
      form.onSubmit(values => {
        return saveEquipmentMutation.mutate({data: values});
      })
    }>
      <Stack>
        <TextInput label={t('name.label')} key={form.key('name')} {...form.getInputProps('name')} />
        <Flex gap={"md"} direction={{ base: "column", sm: "row" }}>
          <NumberInput style={{ flexGrow: 1 }} label={t('cost.label')} prefix="$ " decimalScale={2} fixedDecimalScale key={form.key('cost')} {...form.getInputProps('cost')} />
          <NumberInput style={{ flexGrow: 1 }} label={t('weight.label')} suffix={' '+t('weight.units', {count: form.getValues().weight})} key={form.key('weight')} {...form.getInputProps('weight')} />
        </Flex>
        <Textarea label={t('description.label')} key={form.key('description')} {...form.getInputProps('description')} />
        <Group justify="flex-end" mt="md">
          <Button type={"submit"}>{t('submit')}</Button>
        </Group>
      </Stack>
    </form>
  </Box>
}