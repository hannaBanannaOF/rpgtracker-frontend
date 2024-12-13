import { Avatar, Badge, Flex, Paper, Text, Tooltip } from "@mantine/core";
import { TbArrowBarRight } from "react-icons/tb";

export function ListTile({title, icon, iconTooltipLabel, subTitle, badgeValue, onClick}: {title: string, icon?: React.ReactNode, iconTooltipLabel?: string, subTitle?: string, badgeValue?: string, onClick? : () => void}) {
    return <Paper onClick={() => {
      if (onClick != null) {
        onClick();
      }
    }} shadow="md" p="md" mt="md" styles={{
        root: {
          cursor: 'pointer',
          backgroundColor: 'var(--mantine-primary-color-light)'
        }
      }}>
        <Flex justify='space-between' align='center'>
          <Flex gap='md' align='center'>
            {icon && <Tooltip label={iconTooltipLabel} hidden={iconTooltipLabel == null || iconTooltipLabel == ""}>
              <Avatar>
                {icon}
              </Avatar>
            </Tooltip>}
            <Flex direction='column'>
              <Flex gap='xs' align='center'>
                <Text size="lg" fw={500}>{title}</Text>
                {badgeValue && <Badge color="rpgtracker-teal" size='sm'>{badgeValue}</Badge>}
              </Flex>
              {subTitle && <Text size="sm" fs='italic' c="dimmed">{subTitle}</Text>}
            </Flex>
          </Flex>
          <TbArrowBarRight size={28} />
        </Flex>
      </Paper>
}