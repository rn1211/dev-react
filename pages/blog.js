import React, { useState } from 'react';
import { NextSeo } from 'next-seo';
import classNames from 'classnames';

import {TWHeading} from '../components/ui/Heading';
import TWBlogCard from '../components/ui/TWBlogCard';
import TWContainer from '../components/ui/TWContainer';
import allTags from '../components/ui/helpers/allTags';
import TWCustomLink from '../components/ui/TWCustomLink';

import { frontMatter as blogPosts } from './blog/**/*.mdx';

const url = 'https://amanhimself.dev/';
const title = 'Blog – Aman Mittal';
const description = 'Software developer and React Native enthusiast.';

const Blog = () => {
  const [searchValue, setSearchValue] = useState('');

  const filteredBlogPosts = blogPosts
    .sort(
      (a, b) =>
        Number(new Date(b.publishedAt)) - Number(new Date(a.publishedAt))
    )
    .filter(frontMatter =>
      frontMatter.title.toLowerCase().includes(searchValue.toLowerCase())
    );

  return (
    <>
      <NextSeo
        title={title}
        description={description}
        canonical={url}
        openGraph={{
          url,
          title,
          description
        }}
      />
      <TWContainer as="main" noMargin className="md:px-4 space-y-14">
        <div className="flex flex-col max-w-screen-lg mx-8 items-center justify-center">          
          <TWHeading size="h1">Blog Posts - {blogPosts.length}</TWHeading>
          <p className="text-lg text-gray-500 my-4">A collection of articles, tutorials, and writings.</p>
          <input className="bg-white rounded border-0 p-3 focus:outline-none focus:shadow-outline border border-purple-200 rounded-lg py-2 px-4 block w-3/4 appearance-none leading-normal" type="search" onChange={e => setSearchValue(e.target.value)}
          placeholder="Search a post here... " />
          <div className="flex flex-wrap m-4">
            {allTags.map((tag) => (
              <TWCustomLink key={tag.name}
              scroll={false}
                            to={`/tag/${tag.slug}`}
                  className={classNames(
                  'pointer-events-auto inline-block rounded-lg px-2 py-1 text-xs font-semibold transition-colors duration-200 ease-in-out mx-2 my-2',
                  tag.bgColor,
                  tag.fontColor  
                )}
                >
                  #{tag.name}
                  </TWCustomLink>
            ))}
          </div>
        {!filteredBlogPosts.length && 'No posts found.'}
            {filteredBlogPosts.map(frontMatter => (
              <TWBlogCard key={frontMatter.title} {...frontMatter} />
            ))}          
        </div>      
      </TWContainer>
    </>
  );
};

export default Blog;
