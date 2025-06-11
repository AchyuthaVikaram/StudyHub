
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, Heart, Award } from "lucide-react";
import Header from "@/components/Header";

const About = () => {
  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Co-founder",
      bio: "Former Stanford student passionate about democratizing education",
      image: "/placeholder.svg"
    },
    {
      name: "Mike Chen",
      role: "CTO & Co-founder", 
      bio: "MIT graduate with expertise in AI and educational technology",
      image: "/placeholder.svg"
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Product",
      bio: "Harvard alumna focused on user experience and student success",
      image: "/placeholder.svg"
    }
  ];

  const values = [
    {
      icon: Users,
      title: "Community First",
      description: "We believe in the power of collaborative learning and knowledge sharing among students."
    },
    {
      icon: Target,
      title: "Quality Focus", 
      description: "We ensure only high-quality, verified study materials reach our student community."
    },
    {
      icon: Heart,
      title: "Student Success",
      description: "Every feature we build is designed to help students achieve their academic goals."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We strive for excellence in everything we do, from our platform to our support."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            About StudyShare
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            We're on a mission to democratize education by making quality study materials 
            accessible to students worldwide. Founded by students, for students.
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-16">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl mb-4">Our Mission</CardTitle>
              <CardDescription className="text-blue-100 text-lg max-w-2xl mx-auto">
                To create a global community where students can share knowledge, 
                collaborate, and succeed together through high-quality study materials.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4 mx-auto">
                    <value.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-600">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Story Section */}
        <div className="mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 text-center mb-8">Our Story</h2>
            <div className="prose prose-lg mx-auto text-slate-600">
              <p className="text-lg leading-relaxed mb-6">
                StudyShare was born out of frustration. As students at top universities, our founders 
                experienced firsthand how difficult it could be to find quality study materials. 
                Notes were scattered across different platforms, past papers were hard to come by, 
                and there was no central place for students to share their knowledge.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                In 2023, we decided to change that. We built StudyShare as the platform we wished 
                we had during our studies - a place where students could easily upload, discover, 
                and download high-quality study materials from universities around the world.
              </p>
              <p className="text-lg leading-relaxed">
                Today, StudyShare serves over 100,000 students from top universities worldwide, 
                with more than 500,000 study materials shared by our amazing community. 
                We're just getting started on our mission to make quality education accessible to all.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="w-24 h-24 bg-slate-200 rounded-full mx-auto mb-4"></div>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <CardDescription className="text-blue-600 font-medium">
                    {member.role}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Get in Touch</CardTitle>
              <CardDescription>
                Have questions or suggestions? We'd love to hear from you!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Email:</strong> hello@studyshare.com
                </div>
                <div>
                  <strong>Support:</strong> support@studyshare.com
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;
