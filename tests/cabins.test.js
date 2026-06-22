import assert from "node:assert/strict";
import test from "node:test";
import { CABINS } from "../src/data.js";

const APPROVED = {
  "casa-rafael-mera": ["Casa Rafael Mera", 8, 3, 3, 1, 4056],
  "cabana-mariposa": ["Cabañas Mariposa", 4, 2, 1, 4, 4058],
  "casa-colinanco": ["Casa Coliñanco", 8, 4, 2, 1, 4140],
  "casa-cariman": ["Casa Cariman", 6, 3, 1, 1, 4430],
  "casa-cariman-interior": ["Casa Cariman Interior", 5, 3, 1, 1, 4431],
};

const EXPECTED_BOOKING_LINKS = new Map([
  ["rafael-mera", "https://reservation.gofeels.com/es/room-detail/4056?CLP"],
  ["colinanco", "https://reservation.gofeels.com/es/room-detail/4140?CLP"],
  ["mariposa", "https://reservation.gofeels.com/es/room-detail/4058?CLP"],
  ["cariman", "https://reservation.gofeels.com/es/room-detail/4430?CLP"],
  [
    "cariman-interior",
    "https://reservation.gofeels.com/es/room-detail/4431?CLP",
  ],
]);

function assertHttpsUrl(value, message) {
  const url = new URL(value);
  assert.equal(url.protocol, "https:", message);
  return url;
}

test("cabin ids and slugs are unique", () => {
  assert.equal(new Set(CABINS.map(({ id }) => id)).size, CABINS.length);
  assert.equal(new Set(CABINS.map(({ slug }) => slug)).size, CABINS.length);
});

test("owner-approved inventory is preserved exactly", () => {
  for (const cabin of CABINS) {
    assert.deepEqual(
      [
        cabin.name,
        cabin.capacity.guests,
        cabin.bedrooms.count,
        cabin.bathrooms.count,
        cabin.units,
        cabin.goFeelsRoomId,
      ],
      APPROVED[cabin.slug],
    );
  }
});

test("cabins contain the required trusted inventory fields", () => {
  assert.equal(CABINS.length, 5);

  for (const cabin of CABINS) {
    for (const key of [
      "id",
      "slug",
      "name",
      "type",
      "shortDescription",
      "bookingUrl",
      "futureDetailUrl",
    ]) {
      assert.equal(
        typeof cabin[key],
        "string",
        `${cabin.id}.${key} is required`,
      );
      assert.ok(cabin[key].trim(), `${cabin.id}.${key} must not be empty`);
    }

    assert.match(cabin.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.equal(cabin.futureDetailUrl, `/cabanas/${cabin.slug}/`);
    assert.ok(cabin.longDescription === null || cabin.longDescription.trim());
    assert.ok(Array.isArray(cabin.amenities) && cabin.amenities.length > 0);
    assert.ok(
      Array.isArray(cabin.mapHighlights) && cabin.mapHighlights.length > 0,
    );
  }
});

test("capacity, bedroom, and bathroom values are sane", () => {
  for (const cabin of CABINS) {
    assert.ok(Number.isInteger(cabin.capacity.guests));
    assert.ok(cabin.capacity.guests > 0 && cabin.capacity.guests <= 20);
    assert.ok(cabin.capacity.label.includes(String(cabin.capacity.guests)));

    assert.ok(Number.isInteger(cabin.bedrooms.count));
    assert.ok(cabin.bedrooms.count > 0 && cabin.bedrooms.count <= 20);
    assert.ok(cabin.bedrooms.label.includes(String(cabin.bedrooms.count)));

    assert.ok(Number.isInteger(cabin.bathrooms.count));
    assert.ok(cabin.bathrooms.count > 0 && cabin.bathrooms.count <= 20);
    assert.ok(cabin.bathrooms.label.includes(String(cabin.bathrooms.count)));
  }
});

test("booking and map URLs are valid and existing destinations are preserved", () => {
  for (const cabin of CABINS) {
    const bookingUrl = assertHttpsUrl(cabin.bookingUrl, cabin.id);
    assert.equal(bookingUrl.hostname, "reservation.gofeels.com");
    assert.equal(cabin.bookingUrl, EXPECTED_BOOKING_LINKS.get(cabin.id));

    if (cabin.googleMapsUrl) {
      const mapUrl = assertHttpsUrl(cabin.googleMapsUrl, cabin.id);
      assert.equal(mapUrl.hostname, "maps.app.goo.gl");
    }
  }
});

test("images contain usable metadata", () => {
  for (const cabin of CABINS) {
    assert.ok(cabin.image.src.startsWith("/"));
    assert.ok(cabin.image.alt.trim());
    assert.ok(Number.isInteger(cabin.image.width) && cabin.image.width > 0);
    assert.ok(Number.isInteger(cabin.image.height) && cabin.image.height > 0);
  }
});

test("coordinates are valid when present", () => {
  for (const cabin of CABINS) {
    if (!cabin.coordinates) continue;

    assert.ok(Number.isFinite(cabin.coordinates.lat));
    assert.ok(Number.isFinite(cabin.coordinates.lng));
    assert.ok(cabin.coordinates.lat >= -90 && cabin.coordinates.lat <= 90);
    assert.ok(cabin.coordinates.lng >= -180 && cabin.coordinates.lng <= 180);
  }
});
