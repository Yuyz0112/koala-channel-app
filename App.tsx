import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { useColorScheme, SafeAreaView } from "react-native";
import {
  Button,
  TamaguiProvider,
  Theme,
  YStack,
  styled,
  XStack,
} from "tamagui";
import config from "./tamagui.config";
import NewsCard from "./components/NewsCard";
import data from "./assets/data.json";
import { AnimatePresence } from "@tamagui/animate-presence";
import * as Linking from "expo-linking";

import { ArrowLeft, ArrowRight, RefreshCcw, Link } from "@tamagui/lucide-icons";
import { useState } from "react";

const YStackEnterable = styled(YStack, {
  variants: {
    isLeft: { true: { x: -300, opacity: 0 } },

    isRight: { true: { x: 300, opacity: 0 } },
  } as const,
});

const LinkButton = styled(Button, {
  chromeless: true,
  padding: "$2",
  width: "100%",
  iconAfter: Link,
});

function getRandomIndex() {
  return Math.floor((items.length - 1) * Math.random());
}

const items = data.reduce<
  {
    title: string;
    link: React.ReactNode;
    cover: string;
    bid: string;
    time: number;
  }[]
>((prev, cur) => {
  return prev.concat(
    cur.hn_items.introduces.map((introduce, index) => {
      const link = cur.hn_items.links[index];
      const time = cur.hn_items.times[index];
      return {
        title: introduce,
        link: Array.isArray(link) ? (
          <>
            {link.map((cLink) => (
              <LinkButton
                key={cLink}
                onPress={() => {
                  Linking.openURL(cLink);
                }}
              >
                {cLink}
              </LinkButton>
            ))}
          </>
        ) : link ? (
          <LinkButton
            onPress={() => {
              Linking.openURL(link);
            }}
          >
            {link}
          </LinkButton>
        ) : (
          ""
        ),
        cover: cur.cover.toString(),
        bid: cur.bid,
        time: time ? (time.minutes * 60 + time.seconds) * 1000 - 100 : 0,
      };
    })
  );
}, []);

export default function App() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });

  const [[page, direction], setPage] = useState([getRandomIndex(), 0]);
  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };
  const enterVariant =
    direction === 1 || direction === 0 ? "isRight" : "isLeft";

  const exitVariant = direction === 1 ? "isLeft" : "isRight";

  if (!loaded) {
    return null;
  }

  return (
    <TamaguiProvider config={config}>
      <Theme name={colorScheme === "dark" ? "dark" : "light"}>
        <StatusBar style="auto" />
        <SafeAreaView style={{ flex: 1 }}>
          <XStack
            overflow="hidden"
            position="relative"
            height="100%"
            width="100%"
            alignItems="center"
          >
            <AnimatePresence
              enterVariant={enterVariant}
              exitVariant={exitVariant}
            >
              <YStackEnterable
                f={1}
                alignItems="center"
                justifyContent="center"
                backgroundColor="$backgroundStrong"
                key={page}
                animation="bouncy"
                fullscreen
                x={0}
                opacity={1}
              >
                <NewsCard
                  height="60%"
                  width="80%"
                  margin="$5"
                  title={items[page]?.title || ""}
                  description={items[page]?.link || ""}
                  image={items[page]?.cover}
                  bid={items[page]?.bid || ""}
                  time={items[page]?.time || 0}
                />
              </YStackEnterable>
            </AnimatePresence>

            <XStack
              position="absolute"
              bottom="$10"
              width="100%"
              alignItems="center"
              justifyContent="space-between"
              paddingHorizontal="$4"
            >
              <Button
                accessibilityLabel="Carousel left"
                icon={ArrowLeft}
                size="$5"
                circular
                elevate
                onPress={() => paginate(-1)}
                disabled={page === 0}
              />

              <Button
                accessibilityLabel="random"
                icon={RefreshCcw}
                size="$5"
                circular
                elevate
                onPress={() => setPage([getRandomIndex(), 1])}
              />

              <Button
                accessibilityLabel="Carousel right"
                icon={ArrowRight}
                size="$5"
                circular
                elevate
                onPress={() => paginate(1)}
                disabled={page === items.length - 1}
              />
            </XStack>
          </XStack>
        </SafeAreaView>
      </Theme>
    </TamaguiProvider>
  );
}
