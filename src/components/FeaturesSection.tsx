
import { Upload, Search, Download, Star, Zap, Shield, Users, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const FeaturesSection = () => {
  const features = [
    {
      icon: Upload,
      title: "Easy Upload",
      description: "Upload your notes, past papers, and study guides in seconds. Support for PDF, DOC, and images.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Zap,
      title: "AI-Powered Summaries",
      description: "Get instant AI-generated summaries of your uploaded materials for quick revision.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Search,
      title: "Smart Search",
      description: "Find exactly what you need with advanced filters by subject, university, semester, and more.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: TrendingUp,
      title: "Personalized Recommendations",
      description: "Discover relevant study materials based on your interests and academic history.",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: Star,
      title: "Quality Ratings",
      description: "Community-driven rating system ensures you access only the best study materials.",
      color: "from-yellow-500 to-yellow-600"
    },
    {
      icon: Users,
      title: "Collaborative Learning",
      description: "Connect with fellow students, share knowledge, and build study groups.",
      color: "from-pink-500 to-pink-600"
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Your files are stored securely with enterprise-grade encryption and backup.",
      color: "from-indigo-500 to-indigo-600"
    },
    {
      icon: Download,
      title: "Instant Access",
      description: "Download materials instantly or view them online with our built-in document viewer.",
      color: "from-teal-500 to-teal-600"
    }
  ];

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Everything You Need to
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Excel in Your Studies
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Our platform combines the power of AI with community collaboration to create 
            the ultimate study experience for students worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-2">
              <CardHeader className="pb-4">
                <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-600 leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
