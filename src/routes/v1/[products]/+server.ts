import prisma from "$lib/prisma";
import type { PageServerLoad } from "../../$types";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = (async ({ url }: { url: URL }) => {
  const urlProductId = url.searchParams.get("q");
  const urlProductName = url.searchParams.get("name");
  let product;
  if (urlProductName) {
    product = await prisma.products.findMany({
      where: {
        OR: [
          {
            name: {
              contains: urlProductName,
              mode: "insensitive",
            },
          },
          {
            suppliers: {
              companyname: {
                contains: urlProductName,
                mode: "insensitive",
              },
            },
          },
        ],
      },
      include: {
        ratings: true,
      },
    });
  } else if (urlProductId == "all") {
    product = await prisma.products.findMany({});
  } else {
    product = await prisma.products.findUnique({
      where: {
        productid: urlProductId!,
      },
      include: {
        suppliers: true,
        ratings: true,
      },
    });
  }
  product = JSON.stringify(product, null, 2);
  return new Response(product, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}) satisfies PageServerLoad;
