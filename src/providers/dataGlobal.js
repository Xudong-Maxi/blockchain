// there are 11 energy types
import Colorless from "../images/Colorless.svg";
import Darkness from "../images/Darkness.svg";
import Dragon from "../images/Dragon.svg";
import Fairy from "../images/Fairy.svg";
import Fighting from "../images/Fighting.svg";
import Fire from "../images/Fire.svg";
import Grass from "../images/Grass.svg";
import Lightning from "../images/Lightning.svg";
import Metal from "../images/Metal.svg";
import Psychic from "../images/Psychic.svg";
import Water from "../images/Water.svg";


let defaultGlobal = {
  localTypes: {
    Colorless: {
      bg: "#A0A29F",
      img: Colorless,
    },
    Darkness: {
      bg: "#1e3439",
      img: Darkness,
    },
    Dragon: {
      bg: "#796b44",
      img: Dragon,
    },
    Fairy: {
      bg: "#EE90E6",
      img: Fairy,
    },
    Fighting: {
      bg: "#8e431b",
      img: Fighting,
    },
    Fire: {
      bg: "#9c2221",
      img: Fire,
    },
    Grass: {
      bg: "#5FBD58",
      img: Grass,
    },
    Lightning: {
      bg: "#F2D94E",
      img: Lightning,
    },
    Metal: {
      bg: "#5b5654",
      img: Metal,
    },
    Psychic: {
      bg: "#724b8d",
      img: Psychic,
    },
    Water: {
      bg: "#539DDF",
      img: Water,
    },
    Unknown: {
      bg: "#434343",
      img: null,
    },
  },
  listTypes: [],
  cardsByType:{},
  cardsById:{},
};

export { defaultGlobal };
