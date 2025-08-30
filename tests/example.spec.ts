import { APIResponse, expect, test } from '@playwright/test';
import { StatusCodes } from 'http-status-codes';

test('Get API tags', async ({ request }) => {
  const tagsResponse: APIResponse = await request.get('https://conduit-api.bondaracademy.com/api/tags');
  expect(tagsResponse.status()).toBe(StatusCodes.OK);

  const responseBody: any = await tagsResponse.json();
  expect(responseBody.tags[0]).toEqual('Test');
});

test("Create new article", async ({ request }) => {
  const loginResponse: APIResponse = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
    data: {
      "user": {
        "email": "api-test-user@test.com",
        "password": "apitesting"
      }
    }
  })
  expect(loginResponse.status()).toBe(StatusCodes.OK);

  const loginResponseBody: any = await loginResponse.json();
  const authToken: string = loginResponseBody.user.token;

  const createdArticleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
    data: {
      "article": {
        "title": "x",
        "description": "x",
        "body": "x",
        "tagList": []
      }
    },
    headers: {
      "Authorization": `Token ${authToken}`
    }
  })
  expect(createdArticleResponse.status()).toBe(StatusCodes.CREATED);
  const createdArticleResponseBody: any = await createdArticleResponse.json();
  const articleSlug: string = createdArticleResponseBody.article.slug;

  expect(createdArticleResponseBody.article.title).toEqual("x");

  const gerArticlesResponse = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0', {
    headers: {
      "Authorization": `Token ${authToken}`
    }
  })
  expect(gerArticlesResponse.status()).toBe(StatusCodes.OK);
  const gerArticlesResponseBody: any = await gerArticlesResponse.json();
  expect(gerArticlesResponseBody.articles[0].title).toEqual("x");

  const deletedArticleResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${articleSlug}`, {
    headers: {
      "Authorization": `Token ${authToken}`
    }
  })
  expect(deletedArticleResponse.status()).toBe(StatusCodes.NO_CONTENT);
});

test("Update article", async ({ request }) => {
  const loginResponse: APIResponse = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
    data: {
      "user": {
        "email": "api-test-user@test.com",
        "password": "apitesting"
      }
    }
  })
  expect(loginResponse.status()).toBe(StatusCodes.OK);

  const loginResponseBody: any = await loginResponse.json();
  const authToken: string = loginResponseBody.user.token;

  const createdArticleResponse: APIResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
    data: {
      "article": {
        "title": "New Article",
        "description": "New Article",
        "body": "New Article",
        "tagList": []
      }
    },
    headers: {
      "Authorization": `Token ${authToken}`
    }
  })
  expect(createdArticleResponse.status()).toBe(StatusCodes.CREATED);
  const createdArticleResponseBody: any = await createdArticleResponse.json();
  let articleSlug: string = createdArticleResponseBody.article.slug;

  expect(createdArticleResponseBody.article.title).toEqual("New Article");

  const updatedArticleResponse: APIResponse = await request.put(`https://conduit-api.bondaracademy.com/api/articles/${articleSlug}`, {
    data: {
      "article": {
        "title": "Updated Article Title",
        "description": "Updated Article Description",
        "body": "Updated Article Body",
        "tagList": []
      }
    },
    headers: {
      "Authorization": `Token ${authToken}`
    }
  })
  expect(updatedArticleResponse.status()).toBe(StatusCodes.OK);
  const updatedArticleResponseBody: any = await updatedArticleResponse.json();
  expect(updatedArticleResponseBody.article.title).toEqual("Updated Article Title");
  expect(updatedArticleResponseBody.article.description).toEqual("Updated Article Description");
  expect(updatedArticleResponseBody.article.body).toEqual("Updated Article Body");

  articleSlug = updatedArticleResponseBody.article.slug;

  const deletedArticleResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${articleSlug}`, {
    headers: {
      "Authorization": `Token ${authToken}`
    }
  })
  expect(deletedArticleResponse.status()).toBe(StatusCodes.NO_CONTENT);
});