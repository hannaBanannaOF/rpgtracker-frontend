'use client'

import { Group, Loader as MantineLoader } from "@mantine/core"

export function Loader({ visible } : { visible?: boolean }) {
  return visible && <Group mt="md" justify={"center"}>
    <MantineLoader type="bars"/>  
  </Group>
}