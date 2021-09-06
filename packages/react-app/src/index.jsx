import React from "react";
import ReactDOM from "react-dom";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import "./index.css";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react"
// import { ThemeSwitcherProvider } from "react-css-theme-switcher";
import '@fontsource/mirza';
import '@fontsource/uncial-antiqua';
import { extendTheme } from '@chakra-ui/react';

// const themes = {
//   dark: `${process.env.PUBLIC_URL}/dark-theme.css`,
//   light: `${process.env.PUBLIC_URL}/light-theme.css`,
// };

// const prevTheme = window.localStorage.getItem("theme");


export const theme = extendTheme({
  colors: {
    primaryAlpha: {
      // Base colour is at 500
      200: '#ff95ad',
      300: '#ff6788',
      400: '#ff577c',
      500: '#ff3864',
      600: '#ff194c',
      700: '#ff0940',
      800: '#da0030',
    },

    secondaryAlpha: {
      100: '#120e1f',
      900: '#2c234a',
      1000: '#2f2302',
    },
  },

  fonts: {
    heading: 'Uncial Antiqua',
    body: 'Mirza',
    mono: 'Inconsolata',
  },

  styles: {
    global: {
      body: {
        color: 'white',
        bg: '#211833',
        bgImage: '/homebg.png',
        bgAttachment: 'fixed',
        bgSize: "cover"
      },
    },
  },

  textStyles: {
    p: {
      textTransform: 'uppercase',
    },
    h2: {
      color: 'primaryAlpha.400',
      fontFamily: 'body',
      fontSize: ['md', 'lg', 'xl']
    },
    h3: {
      fontFamily: 'Mirza',
      fontSize: ['md', 'lg', 'xl']
    }
  },

  components: {
    Button: {
      defaultProps: {
        colorScheme: 'primaryAlpha',
        variant: 'solid',
        fontWeight: '400',
      },
      variants: {
        solid: () => ({
          textTransform: 'uppercase',
        }),
        outline: () => ({
          textTransform: 'uppercase',
        }),
      },
    },

    Form: {
      defaultProps: {
        width: '90%',
        textAlign: 'left',
        paddingTop: '2em',
        paddingBottom: '2em',
      },
    },

    Input: {
      defaultProps: {
        variant: 'rg',
      },
      parts: ['field'],
      variants: {
        rg: {
          field: {
            color: 'white',
            bg: 'black',
            border: '1px solid',
            borderColor: 'primaryAlpha.500',
            margin: '5px',
          },
        },
      },
    },

    Text: {
      defaultProps: {
        variant: 'rg',
      },
      variants: {
        rg: {
          color: 'white',
          bg: 'black',
          margin: '5px',
          textTransform: 'uppercase',
        },
      },
    },

    Heading: {
      defaultProps: {
        colorScheme: 'primaryAlpha',
        fontFamily: 'body',
        color: 'primaryAlpha.400'
      },
      baseStyle: {
        color: "primaryAlpha.400",
        fontFamily: "body"
      },
      variants: {
        rg: {
          color: 'primaryAlpha.600',
          fontFamily: 'heading'
        }
      },
      sizes: {
        md: {
          color: "primaryAlpha.500",
          fontFamily: "body"
        }
      }
    },

    Modal: {
      parts: ['dialog'],
      baseStyle: {
        dialog: {
          bg: 'black',
          color: 'primary.500',
          border: '1px solid',
          borderColor: 'primary.800',
        },
      },
    },
  },
});

let subgraphUri = "http://localhost:8000/subgraphs/name/scaffold-eth/your-contract"

const client = new ApolloClient({
  uri: subgraphUri,
  cache: new InMemoryCache()
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <ChakraProvider theme={theme}>
      <App subgraphUri={subgraphUri} />
    </ChakraProvider>
  </ApolloProvider>,
  document.getElementById("root"),
);
