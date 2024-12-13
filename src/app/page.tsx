import { Divider } from "@mantine/core";
import { NextSession } from "./nextsession";
import { Calendar } from "./calendar";

export default function Home() {
  return <>
    <NextSession />
    <Divider my="md"/>
    <Calendar />
  </>;
}
