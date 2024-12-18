import getReadingTime from 'reading-time';
import {toString} from 'mdast-util-to-string';

export const remarkReadingTime = () => {
  return function (tree: any, {data}: {data: any}) {
    data.astro.frontmatter.readingTime = getReadingTime(toString(tree));
  };
};
