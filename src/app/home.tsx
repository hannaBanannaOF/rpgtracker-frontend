'use client';

import { Box, Divider, LoadingOverlay } from "@mantine/core";
import { Calendar } from "./calendar";
import { NextSession } from "./nextsession";
import { useState } from "react";

export function Home() {

  const [loading, setLoading] = useState(false);

  return <Box pos="relative">
    <LoadingOverlay visible={loading} />
    <NextSession setLoadingHome={setLoading}/>
    <Divider my="md"/>
    <Calendar />
  </Box>;
}