import * as React from 'react';
import { graphql } from 'gatsby';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';

import { Layout, Hero, SEO, PostInfo, InfoCard } from '../components';
import { config } from '../helpers';

const CenterEverything = styled.div`
  text-align: center;
`;

const IndexPage = ({ data }) => {
  const posts = data.posts.nodes;
  return (
    <Layout>
      <Helmet title={`Home | ${config.username}`} />
      <SEO />
      <Hero />
      <div>
        <h2>
          <span role="img" aria-label="sparkle emoji">
            ✨{' '}
          </span>
          If you only read one post, you should read one of the following:
        </h2>
        <CenterEverything>
          {posts.map(post => {
            return <PostInfo post={post} />;
          })}
        </CenterEverything>
        <h2>
          <span role="img" aria-label="compass emoji">
            🧭{' '}
          </span>
          Some of the open source projects I've worked on:
        </h2>
        <CenterEverything>
          <InfoCard
            title="Quarantine Pro app"
            description="Built using React Native and Expo, about how long you have been quarantining. As a user, you input the date when you started isolating and the app is going to display a fun message to tell you how far you have come in the quarantine 'game'."
            href="https://expo.io/@amanhimself/quarantinepro"
            expoIcon
            reactIcon
          />
          <InfoCard
            title="Expo Firebase Starter"
            description="Currently building and maintaining a quicker way to start with Expo + Firebase projects. Based on latest Expo SDK, provides. Part of expo-community."
            href="https://github.com/expo-community/expo-firebase-starter"
            expoIcon
            firebaseIcon
          />
          <InfoCard
            title="100DaysOfCode Twitter Bot"
            description="Twitter bot for #100DaysOfCode community hosted by freeCodeCamp. Written in Node.js and currently hosted on a private repository."
            href="https://github.com/freeCodeCamp/100DaysOfCode-twitter-bot"
            githubIcon
          />
        </CenterEverything>
        <h2>
          <span role="img" aria-label="speech bubble emoji">
            💬{' '}
          </span>
          Speaking:
        </h2>
        <CenterEverything>
          <InfoCard
            title="How to write consistently?"
            description="At Hashnode's Technical Writing Bootcamp, a free virtual Bootcamp to help beginner technical writers to improve their writing skill."
            href="https://www.youtube.com/watch?v=YIRxTUCY0NQ"
            youtubeIcon
          />
        </CenterEverything>
        <h2>
          <span role="img" aria-label="headphone emoji">
            🎧{' '}
          </span>
          Guest Podcast Appearances & Interviews:
        </h2>
        <CenterEverything>
          <InfoCard
            title="React Round Up 006"
            description="Setting Up and Getting Used to Gatsby with Charles Max Wood, Cory House, Tara Manicsic and Kent C Dodds."
            href="https://dev.to/reactroundup/rru-006-setting-up-and-getting-used-to-gatsby-with-aman-mittal"
            podcastIcon
          />
          <InfoCard
            title="Dev Bites"
            description=" Development Trends on the Horizon with Hoss on remote work and serverless - hosted by Hoss.com"
            href="https://www.hoss.com/blog/dev-bites-development-trends-on-the-horizon-aman-mittal"
          />
        </CenterEverything>
        <h2>
          <span role="img" aria-label="laptop emoji">
            💻{' '}
          </span>
          Uses:
        </h2>
        <CenterEverything>
          <div>
            <ul style={{ listStyleType: 'none' }}>
              <li>Computer: MacBook Pro 2020</li>
              <li>Editor: Visual Studio Code</li>
              <li>Static Site Generator: Gatsbyjs</li>
              {/* <li>Syntax Highlighting: Prismjs</li> */}
              <li>Code Syntax Theme: fairyFloss, Morgan.codes</li>
              <li>Terminal: iTerm with ZSH shell</li>
              <li>Manage Blog posts pipeline: Notion</li>
              <li>Newsletter: Substack (free)</li>
            </ul>
          </div>
        </CenterEverything>
        <h2>
          <span role="img" aria-label="aeroplane emoji">
            ✈️{' '}
          </span>
          Countries I've Visited (8):
        </h2>
        <CenterEverything>
          <span role="img" aria-label="flag emojis">
            I love to travel: 🇦🇪 🇵🇱 🇨🇿 🇦🇹 🇸🇰 🇩🇪 🇧🇪 🇳🇱
          </span>
        </CenterEverything>
      </div>
    </Layout>
  );
};

export const blogPageQuery = graphql`
  {
    posts: allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/content/posts/" } }
      sort: { fields: frontmatter___date, order: DESC }
      limit: 3
    ) {
      nodes {
        id
        timeToRead
        fields {
          slug
        }
        frontmatter {
          title
          date(formatString: "MMMM D, YYYY")
          tags
          thumbnail {
            childImageSharp {
              gatsbyImageData(layout: FIXED, width: 40, height: 40)
            }
          }
        }
      }
    }
  }
`;

export default IndexPage;
