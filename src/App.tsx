import * as React from "react";
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
  Button,
} from "@chakra-ui/react";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { Logo } from "./Logo";
import { TourGuide } from "./components/TourGuide";
import { contents } from "./constants/contents";

export const App = () => {
  const [started, setStarted] = React.useState(false);

  return (
    <ChakraProvider theme={theme}>
      <TourGuide
        content={contents}
        enabled={started}
        onFinish={() => setStarted(false)}
      />
      <Box textAlign="center" fontSize="xl">
        <Grid minH="100vh" p={3}>
          <ColorModeSwitcher justifySelf="flex-end" id="toggle-btn" />
          <VStack spacing={8}>
            <Button onClick={() => setStarted(!started)} zIndex={1302}>
              {started ? "Stop" : "Start"}
            </Button>
            <Logo h="40vmin" pointerEvents="none" id="chakra-logo" />
            <Text>
              Edit <Code fontSize="xl">src/App.tsx</Code> and save to reload.
            </Text>
            <Link
              id="chakra-link"
              color="red.500"
              href="https://chakra-ui.com"
              fontSize="2xl"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn Chakra
            </Link>
          </VStack>
        </Grid>
      </Box>
    </ChakraProvider>
  );
};
