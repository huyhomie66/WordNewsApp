import { useTheme } from "@react-navigation/native";
import React, { useEffect, useState, useContext } from "react";
import { ScrollView, Linking, View, Animated } from "react-native";
import openMap from "react-native-open-maps";
import styled from "styled-components/native";

import ActionMenu from "../common/ActionMenu";
import Countdown from "../common/Countdown";
import Icon from "../common/Icon";
import Label from "../common/Label";
import { openLink } from "../helpers/OpenLink";
import AppState from "../stores/AppState";

const IMAGE_HEIGHT = 400;

const Image = styled(Animated.Image)`
  height: ${IMAGE_HEIGHT + 50}px;
  width: 100%;
  position: absolute;
  background: #888;
`;

const Title = styled.Text`
  font-weight: bold;
  font-size: 28px;
  padding: 24px 16px;
  text-align: center;
  color: ${({ theme }) => theme.text};
`;

const ContentWrapper = styled.View`
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
  margin-top: -30px;
  background: ${({ theme }) => theme.background};
`;

const PinLabel = styled.Text`
  margin-left: 10px;
  font-size: 14px;
  padding-right: 20px;
  color: ${({ theme }) => theme.text};
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`;

const DescText = styled.Text`
  margin-bottom: 16px;
  font-size: 17px;
  color: ${({ theme }) => theme.text};
`;

const DescWrapper = styled.View`
  padding: 20px;
  margin: 16px 0;
  background: ${({ theme }) => theme.secondary};
`;

const Subtitle = styled.Text`
  margin: 30px 0 0 20px;
  font-size: 25px;
  font-weight: bold;
  color: ${({ theme }) => theme.text};
`;

interface Props {
  route: any;
}

const Details: React.FC<Props> = ({ route, navigation }) => {
  useEffect(() => {
  }, []);

  const [scrollY] = useState(new Animated.Value(0));
  const { colors } = useTheme();
  const appStateStore = useContext(AppState);

  const { data } = route.params;
  const videoLink =
    data.vidURLs && data.vidURLs.length > 0 && data.vidURLs[0].url;
  const wikiLink = data.launch_service_provider.wiki_url;
  const lspAbbrev = data.launch_service_provider.abbrev
    ? data.launch_service_provider.abbrev
    : "";
  const missionType = data.mission ? data.mission.type : "Unknown";
  const missionDescription = data.mission
    ? data.mission.description
    : "No Description Available";

  const actionItems = [
    [
      {
        title: "Livestream",
        icon: "ChevronRight",
        preview: !videoLink && "Unavailable",
        thumbIcon: !videoLink ? "VideoOff" : "Video",
        thumbColor: "#fa8435",
        disabled: !videoLink,
        action: () => {
          Linking.openURL(videoLink);
        },
      },
      {
        title: "Location",
        icon: "ChevronRight",
        thumbIcon: "Pin",
        thumbColor: "#2dcd55",
        action: () => {
          const { latitude, longitude } = data.pad;
          const lat = parseFloat(latitude);
          const lon = parseFloat(longitude);
          openMap({ latitude: lat, longitude: lon });
        },
      },
      {
        title: `${lspAbbrev} Wikipedia`,
        icon: "ChevronRight",
        preview: !wikiLink && "Unavailable",
        thumbIcon: "Globe",
        thumbColor: "#1889ff",
        disabled: !wikiLink,
        action: () => {
          openLink(wikiLink, appStateStore.browser);
        },
      },
    ],
  ];

  const ImageScale = scrollY.interpolate({
    inputRange: [-100, 0, 200],
    outputRange: [1.4, 1.2, 1],
    extrapolate: "clamp",
  });

  return (
    <View style={{ overflow: "hidden" }}>
      <Image
        source={{ uri: data.image || data.rocket.configuration.image_url }}
        style={{ transform: [{ scale: ImageScale }] }}
      />
      <Animated.ScrollView
        contentContainerStyle={{ paddingTop: IMAGE_HEIGHT }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          {
            useNativeDriver: true,
          }
        )}
      >
        <View style={{ backgroundColor: colors.background }}>
          <ContentWrapper>
            <Title>{data.name}</Title>
            <Countdown net={data.net} status={data.status.id} />
            <Subtitle>Mission</Subtitle>
            <DescWrapper>
              <View>
                <Label text={missionType} />
                <View style={{ marginTop: 10 }}>
                  <DescText>{missionDescription}</DescText>
                </View>
              </View>
              {data.launch_service_provider.name && (
                <Row>
                  <Icon name="Briefcase" color={colors.primary} size={20} />
                  <PinLabel numberOfLines={2}>
                    {data.launch_service_provider.name}
                  </PinLabel>
                </Row>
              )}
              {data.net && (
                <Row>
                  <Icon name="Clock" color={colors.primary} size={20} />
                  <PinLabel numberOfLines={2}>
                    {new Date(data.net).toLocaleString()}
                  </PinLabel>
                </Row>
              )}
              {data.pad.name && (
                <Row>
                  <Icon name="Pin" color={colors.primary} size={20} />
                  <PinLabel numberOfLines={2}>
                    {data.pad.location.name}
                  </PinLabel>
                </Row>
              )}
            </DescWrapper>
            <ActionMenu items={actionItems} />
          </ContentWrapper>
        </View>
      </Animated.ScrollView>
    </View>
  );
};

export default Details;
