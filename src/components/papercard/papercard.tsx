import { MantineSpacing, Paper, StyleProp } from "@mantine/core";

export function PaperCard({ my, children } : { my?: StyleProp<MantineSpacing>, children: any }) {
  return <Paper shadow="md" p="md" my={my} styles={{
    root: {
      backgroundColor: 'var(--mantine-color-default-hover)',
    }
  }}>
      {children}
  </Paper>
}