import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Linking,
} from "react-native";
import RSSParser from "react-native-rss-parser";

export default function App() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const RSS_URL = "https://news.google.com/rss?hl=ta&gl=IN&ceid=IN:ta";

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch(RSS_URL);
      const text = await response.text();
      const parsedData = await RSSParser.parse(text);

      const articles = parsedData.items.map((item) => {
        const publisher = item.publisher || extractPublisher(item.title);
        return {
          title: item.title,
          link: item.links[0].url,
          pubDate: new Date(item.published).toDateString(),
          description: item.description,
          imageUrl: extractImage(item.content || ""),
          publisher,
          publisherImage: getPublisherImage(publisher),
        };
      });

      setNews(articles);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  // Extract image from <content>
  const extractImage = (content) => {
    if (!content) return "https://via.placeholder.com/150"; // Default image
    const match = content.match(/<img.*?src="(.*?)"/);
    return match ? match[1] : "https://via.placeholder.com/150"; // Fallback image
  };

  // Extract publisher from title (if not provided in RSS)
  const extractPublisher = (title) => {
    const knownPublishers = [
      "நக்கீரன்",
      "Hindustan",
      "தினமணி",
      "தினத்",
      "IBC",
      "Puthiya",
      "Maalaimalar",
      "Vikatan",
      "Hindu",
      "Vatican",
      "Lankasri",
      "Indian",
      "Oneindia",
      "Goodreturns",
      "Dinakaran",
      "enewz",
      "News18",
      "News7",
      "BBC",
      "Dinamalar",
      "Dinasuvadu",
    ];

    for (let pub of knownPublishers) {
      if (title.includes(pub)) {
        return pub;
      }
    }
    return "Unknown";
  };

  // Map publisher name to logo image
  const getPublisherImage = (publisher) => {
    const publisherLogos = {
      நக்கீரன்:
        "https://github.com/user-attachments/assets/40a13f23-d2e1-4f83-a042-4472da15aa2e",
      Dinamalar:
        "https://github.com/user-attachments/assets/3da84a03-828b-40fb-9eae-46d8c274f284",
      தினமணி:
        "https://github.com/user-attachments/assets/4f127c46-8c3d-4d51-a517-0882cb37b2da",
      தினத்:
        "https://github.com/user-attachments/assets/28d3b77b-c026-488e-a4ad-8831d048d28c",
      IBC: "https://github.com/user-attachments/assets/123c2455-eed2-4433-8fb1-402b23c360c5",
      Puthiya:
        "https://github.com/user-attachments/assets/a75994e4-79b0-4cfe-8e9a-3c58b363bd4d",
      Maalaimalar:
        "https://github.com/user-attachments/assets/5f5f86df-c3f5-441e-b17a-2bbe0d67c0cf",
      Hindustan:
        "https://github.com/user-attachments/assets/eec59781-fec3-4c59-936a-039538d94718",
      Vikatan:
        "https://github.com/user-attachments/assets/4595e118-2a8d-473f-ad52-c3a570b8faff",
      Hindu:
        "https://github.com/user-attachments/assets/74d701b3-8c39-4a81-852a-894b913160e4",
      Vatican:
        "https://github.com/user-attachments/assets/ba72faf4-f692-4146-9a83-eefd1faa7d02",
      Lankasri:
        "https://github.com/user-attachments/assets/5debee2c-649d-42c5-b788-a1eb6fed207a",
      Indian:
        "https://github.com/user-attachments/assets/a86ef7eb-2a3e-403e-8e3d-7423abd06290",
      Oneindia:
        "https://github.com/user-attachments/assets/2b8da88a-7f86-449d-a7ae-07af46f8ea0f",
      Goodreturns:
        "https://github.com/user-attachments/assets/beaf5902-2854-454a-a8ab-82668a40dc9b",
      Dinakaran:
        "https://github.com/user-attachments/assets/245caa6a-cd97-4ebd-9685-e6f4999c75f5",
      enewz:
        "https://github.com/user-attachments/assets/9c22e10f-2c0b-4255-8803-ad8b11606d74",
      News18:
        "https://github.com/user-attachments/assets/36cd082c-2782-4f79-895c-a00f2b07f7ad",
      News7:
        "https://github.com/user-attachments/assets/27c93e53-f869-4763-97b3-6877eb1af46f",

      BBC: "https://github.com/user-attachments/assets/54c18ff9-527d-4109-a1e0-37bd5e41d4e3",
      Dinasuvadu: "https://example.com/dinasuvadu-logo.jpg",
      Unknown:
        "https://github.com/user-attachments/assets/1beab735-a8f3-47c4-a493-5be2d0551b52",
    };

    return publisherLogos[publisher] || publisherLogos["Unknown"];
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📢 தமிழ் செய்திகள்</Text>

      {loading ? (
        <ActivityIndicator size="large" color="crimson" />
      ) : (
        <FlatList
          data={news}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.newsItem}>
              <Image
                source={{ uri: item.publisherImage }}
                style={styles.newsImage}
              />
              <View style={styles.publisherContainer}>
                <Image
                  source={{ uri: item.publisherImage }}
                  style={styles.publisherLogo}
                />
              </View>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.pubDate}>{item.pubDate}</Text>
              <TouchableOpacity
                onPress={() => Linking.openURL(item.link)}
                style={styles.button}
              >
                <Text style={styles.buttonText}>மேலும் வாசிக்க</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f8f8f8" },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "crimson",
    textAlign: "center",
    marginBottom: 15,
  },
  newsItem: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
  },
  newsImage: { width: "100%", height: 200, borderRadius: 10, marginBottom: 10 },
  publisherContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  publisherLogo: { width: 30, height: 30, borderRadius: 15, marginRight: 10 },
  publisher: { fontSize: 16, fontWeight: "bold", color: "#333" },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  pubDate: { fontSize: 14, color: "gray", marginBottom: 5 },
  button: {
    backgroundColor: "crimson",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
