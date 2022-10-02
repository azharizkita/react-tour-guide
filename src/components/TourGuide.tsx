import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Placement } from "@popperjs/core";
import React, { ReactNode, useState } from "react";
import { usePopper } from "react-popper";

export interface StepContent {
  title: ReactNode;
  content: ReactNode;
  target: string;
  placement: Placement;
}

export const TourGuide = ({
  content,
  enabled = false,
  onFinish,
}: {
  content: StepContent[];
  enabled?: boolean;
  onFinish: () => void;
}) => {
  const [step, setStep] = useState(0);
  const referenceElement = document.getElementById(content[step].target);
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: content[step].placement,
  });

  const startHighlight = (current: number) => {
    const currentElm = document.getElementById(content[current].target);
    // recursively check the target element to be exist
    if (!currentElm) {
      setTimeout(() => {
        startHighlight(current);
      }, 250);
      return;
    }
    // since chakra overlay zIndex is equals to 1300
    // let's make it a bit higher
    currentElm.style.zIndex = "1301";
    currentElm.style.background = "rgba(255,255,255,0.7)";
  };

  const stopHighlight = (current: number) => {
    const currentElm = document.getElementById(content[current].target);
    // recursively check the target element to be exist
    if (!currentElm) {
      setTimeout(() => {
        startHighlight(current);
      }, 250);
      return;
    }
    // set the element zIndex into it's default
    // note: this should be the original value. make a
    // local storage data to store the original value?
    currentElm.style.zIndex = "0";
    currentElm.style.background = "";
  };

  const proceedToNextStep = () => {
    return setStep((current) => {
      const next = current + 1;
      // stop highlighting the current target element
      stopHighlight(current);
      // highlight the next element
      startHighlight(next);
      return next;
    });
  };

  const proceedToPreviousStep = () => {
    return setStep((current) => {
      const previous = current - 1;
      // stop highlighting the current target element
      stopHighlight(current);
      // highlight the previous element
      startHighlight(previous);
      return previous;
    });
  };

  React.useEffect(() => {
    if (!enabled) {
      // back to step 0 if enabled flag sets to false
      setStep((current) => {
        stopHighlight(current);
        return 0;
      });
      return;
    }

    // highlight the first target element
    startHighlight(step);
    // make the whole page unscrollable if tour guide is active
    document.body.style.overflowY = "hidden";

    return () => {
      // bring back the scroll capability
      document.body.style.overflowY = "auto";
    };
  }, [enabled]);

  const isFinalStep = content.length - 1 === step;
  const isFirstStep = step !== 0;

  return (
    <>
      {enabled && (
        <Box
          top={0}
          left={0}
          bottom={0}
          right={0}
          position={"fixed"}
          zIndex="overlay"
          background={"black"}
          opacity={"0.25"}
        />
      )}

      {enabled && (
        <Flex
          transition={"all 0.25s ease"}
          ref={setPopperElement}
          {...attributes.popper}
          style={styles.popper}
          zIndex={"modal"}
          p="0.5em"
        >
          <Box p="1em" bg="gray.50" borderWidth={"thin"} maxW="21em">
            <Stack spacing={"1em"}>
              <Flex direction={"column"}>
                <Heading size={"md"}>{content[step].title}</Heading>
                <Divider />
              </Flex>
              <Flex>
                <Text>{content[step].content}</Text>
              </Flex>
              <Flex>
                <Button
                  transition={"all 0.25s ease"}
                  opacity={isFirstStep ? 1 : 0}
                  w="fit-content"
                  variant={"ghost"}
                  onClick={proceedToPreviousStep}
                >
                  Back
                </Button>
                <Spacer />
                <Button
                  transition={"all 0.25s ease"}
                  w="fit-content"
                  colorScheme={"blue"}
                  onClick={() => {
                    if (isFinalStep) {
                      stopHighlight(step);
                      onFinish();
                      return;
                    }
                    proceedToNextStep();
                  }}
                >
                  {isFinalStep ? "Finish guide" : "Next"}
                </Button>
              </Flex>
            </Stack>
          </Box>
        </Flex>
      )}
    </>
  );
};
