import React, { useState, useEffect } from 'react';
import Helmet from 'react-helmet';
import { graphql, Link } from 'gatsby';
import Layout from '../components/Layout';
import PostListing from '../components/PostListing';
import config from '../data/site-config';

export default class BlogPage extends React.Component {
  state = {
    searchTerm: '',
    posts: this.props.data.posts.edges,
    filteredPosts: this.props.data.posts.edges
  };

  handleChange = event => {
    const { name, value } = event.target;

    this.setState({ [name]: value }, () => this.filterPosts());
  };

  filterPosts = () => {
    const { posts, searchTerm } = this.state;

    const filteredPosts = posts.filter(post =>
      post.node.frontmatter.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

    this.setState({ filteredPosts });
  };

  render() {
    const { filteredPosts, searchTerm } = this.state;
    const filterCount = filteredPosts.length;
    const categories = this.props.data.categories.group;

    return (
      <Layout>
        <Helmet title={`Articles – ${config.siteTitle}`} />
        <div className='container'>
          <h1 className='articles-title'>Articles</h1>
          <div className='category-container'>
            {categories.map(category => {
              return (
                <Link
                  to={`/categories/${category.fieldValue.toLowerCase()}`}
                  className='category-filter'
                  key={category.fieldValue}
                >
                  {category.fieldValue}
                </Link>
              );
            })}
          </div>
          <div className='search-container'>
            <input
              className='search'
              type='text'
              name='searchTerm'
              value={searchTerm}
              placeholder='Type here to search for a post...'
              onChange={this.handleChange}
            />
            <div className='filter-count'>{filterCount}</div>
          </div>
          <PostListing postEdges={filteredPosts} />
        </div>
      </Layout>
    );
  }
}

export const pageQuery = graphql`
  query BlogQuery {
    posts: allMarkdownRemark(
      limit: 2000
      sort: { fields: [fields___date], order: DESC }
      filter: { frontmatter: { template: { eq: "post" } } }
    ) {
      edges {
        node {
          fields {
            slug
            date
          }
          excerpt(pruneLength: 180)
          timeToRead
          frontmatter {
            title
            tags
            categories
            thumbnail {
              childImageSharp {
                fixed(width: 150, height: 150) {
                  ...GatsbyImageSharpFixed
                }
              }
            }
            date
            template
          }
        }
      }
    }
    categories: allMarkdownRemark(limit: 2000) {
      group(field: frontmatter___categories) {
        fieldValue
        totalCount
      }
    }
  }
`;
