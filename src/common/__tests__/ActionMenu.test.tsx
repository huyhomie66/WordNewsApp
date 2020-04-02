import React from "react";
import ActionMenu from "../ActionMenu";
import renderer from "react-test-renderer";

jest.mock("../Icon", () => "Icon");

describe("ActionMenu", () => {
  it("renders correctly", () => {
    const props = {
      items: [
        [
          {
            title: "$_TEST_TITLE_$",
            icon: "$_TEST_ICON_$",
          },
          {
            title: "$_TEST_TITLE_$",
            icon: "$_TEST_ICON_$",
            disabled: true,
          },
        ],
        [
          {
            title: "$_TEST_TITLE_$",
            icon: "$_TEST_ICON_$",
            thumbColor: "tomato",
          },
          {
            title: "$_TEST_TITLE_$",
            icon: "$_TEST_ICON_$",
            preview: "$_PREVIEW_TEXT_$",
          },
          {
            title: "$_TEST_TITLE_$",
            icon: "$_TEST_ICON_$",
            action: jest.fn(),
          },
        ],
        [
          {
            title: "$_TEST_TITLE_$",
            icon: "$_TEST_ICON_$",
            thumbIcon: "$_TEST_THUMB_ICON_$",
          },
          {
            title: "$_TEST_TITLE_$",
            icon: "$_TEST_ICON_$",
            thumbImage: "$_TEST_THUMB_IMAGE_$",
          },
          {
            title: "$_TEST_TITLE_$",
            icon: "$_TEST_ICON_$",
            thumbImage: 1,
          },
        ],
      ],
    };
    const tree = renderer.create(<ActionMenu {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
