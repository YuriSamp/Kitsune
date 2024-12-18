import getReadingTime from 'reading-time';
import {toString} from 'mdast-util-to-string';

export const remarkReadingTime = () => {
  return function (tree, {data}) {
    data.astro.frontmatter.readingTime = getReadingTime(toString(tree));
  };
};
