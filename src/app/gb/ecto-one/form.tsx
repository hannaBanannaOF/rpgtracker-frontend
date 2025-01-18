import { Box, Button, Grid, Group, LoadingOverlay, NumberInput, TextInput } from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import * as Yup from 'yup'

export function EctoOneForm({ formTranslationNamespace, onSubmit }: { formTranslationNamespace: string, onSubmit: () => void }) {

  const t = useTranslations(formTranslationNamespace);
  const queryClient = useQueryClient();

  const saveEctoOne = async ({ data }: { data: EctoOne }) => {
    return await fetch(`/gb/api/ecto-one`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      body: JSON.stringify(data)
    },).then(response => {
      if (response.redirected) {
        window.location.href = response.url;
      }
      if (response.ok) {
        notifications.show({
          color: 'green',
          message: t('notifications.success'),
          position: 'top-right'
        })
      } else {
        notifications.show({
          color: 'red',
          message: t('notifications.error'),
          position: 'top-right'
        })
      }
      queryClient.invalidateQueries({queryKey: ['gb-ecto-one-list']})
      return null;
    })
  }

  const saveEctoOneMutation = useMutation({
    mutationFn: saveEctoOne,
    onSuccess: () => {
      onSubmit();
    }
  })

  const schema = Yup.object().shape({
    name: Yup.string().required(t('name.required')),
    cost: Yup.number().typeError(t('cost.must_be_number')).required(t('cost.required')).min(0.01, t('cost.min_value')),
    seats: Yup.number().typeError(t('seats.must_be_number')).required(t('seats.required')).min(1, t('seats.min_value')),
    carryWeight: Yup.number().typeError(t('carryWeight.must_be_number')).required(t('carryWeight.required')).min(1, t('carryWeight.min_value'))
  });

  const form = useForm({
    mode: 'controlled',
    initialValues: {
      name: "",
      cost: 0.00,
      carryWeight: 0,
      seats: 0
    },
    validate: yupResolver(schema)
  })

  return <Box pos={"relative"}>
    <LoadingOverlay visible={saveEctoOneMutation.isPending} />
    <form onSubmit={
      form.onSubmit(values => {
        return saveEctoOneMutation.mutate({data: values});
      })
    }>
      <Grid>
        <Grid.Col>
          <TextInput label={t('name.label')} key={form.key('name')} {...form.getInputProps('name')} />
        </Grid.Col>
        <Grid.Col span={4}>
          <NumberInput label={t('cost.label')} prefix="$ " decimalScale={2} fixedDecimalScale key={form.key('cost')} {...form.getInputProps('cost')} />
        </Grid.Col>
        <Grid.Col span={4}>
          <NumberInput label={t('seats.label')} key={form.key('seats')} {...form.getInputProps('seats')} />
        </Grid.Col>
        <Grid.Col span={4}>
          <NumberInput label={t('carryWeight.label')} suffix={' '+t('carryWeight.units', {count: form.getValues().carryWeight})} key={form.key('carryWeight')} {...form.getInputProps('carryWeight')} />
        </Grid.Col>
      </Grid>
      <Group justify="flex-end" mt="md">
        <Button type={"submit"}>{t('submit')}</Button>
      </Group>
    </form>
  </Box>
}