---
layout: post
title: "Using Discourse-API-Java in Android Studio"
modified:
categories: 
excerpt: "In my first Andriod project, an Discourse Android Client for my forum, I tried to use a open sourse library **Discourse-API-Java** and met difficulties. After a few hours searching on the Internet, and some Adjustement on the source code It finally works."
tags: []
comments: true
image:
  feature: lamp.jpg
date: 2015-01-08T16:11:03+01:00
---

In my first Andriod project, an Discourse Android Client for my forum, I tried to use a open sourse library **Discourse-API-Java** and met difficulties. After a few hours searching on the Internet, and some Adjustement on the source code It finally works.

Discourse-API-Java is a Java encapsuled Discourse REST-API developed by [@Wareninja](https://github.com/wareninja), hosted on [Github](https://github.com/wareninja/discourse-api-client). It should work flawlessly on Android as I read through the sourse code and it description also declaimed that. The source code is pretty simple and very easy to read.  

>works also on Android platform!
>Goal is to implement simple & readable Java code, reusable to communicate with Discourse API endpoints.

### Adding Dependencies:
The module depends on `org.apache.httpcomponents:httpclient-android:4.3.5` and if use source code directly, then `com.google.code.gson:gson:2.3.1` is needed. They could be added in File->Project Structure->Dependencies. Just search for the libs and add them. After the gradle sync, it is recommended to clean the project once (by me). 

### Some issues
1. It can not be directly used in Android Studio. The App will crash after lauch due to the error: `java.lang.IllegalArgumentException: Item may not be null`. When digging into the source code of HttpClient, It turns out that the SSL SocketFactory is not initialized when creating the CloseableHttpResponse object. Therefore, the Discourse-API-Java project need to be forked and import it manually. 
  What should be modified is in the MyWebClient.java. In the initBase() method, an initalization of SSLConnectionSoketFactory should be added. 

    {% highlight java %}
    //SSLConnectionSocketFactory initialized.
    SSLContext sslContext = SSLContexts.createSystemDefault();
    SSLConnectionSocketFactory sslsf = new SSLConnectionSocketFactory(
                    sslContext,
                    SSLConnectionSocketFactory.STRICT_HOSTNAME_VERIFIER);
    
    httpClient = HttpClientBuilder.create()
                   .setSSLSocketFactory(sslsf)
                   .build();
    {% endhighlight %}

2. Some method are not recognized like `.setConfig` of HttpPost, HttpGet, etc. I have no idea about it. I haven't find official document explaining this for the HttpClient Android 3.5 and all the old API documentations included this method. It's odd. Since it is not very important, I commentted them out temporally.
3. In my HttpClient library, the StringEntity class doesn't have a constructor which takes String and ContentType as parameter. You could only init it with data content and charset. However the content type is required. So they are added manually use `setHeader()`
    {% highlight java %}
        try {
            requestEntity = new StringEntity(jsonBodyStr,"UTF-8");
            httpPost.setEntity(requestEntity);
            httpPost.setHeader("Content-type", "application/json");
            Log.v("httpPost",jsonBodyStr);
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
{% endhighlight %}


### Finally works

Invoke it inside a AsyncTask and finally that's it. It really takes me a few hours to debug it. 

Here's an example:
{% highlight java %} 
public class DiscourseAPIRequest extends AsyncTask<Void, Void, Void> {
        @Override
        protected Void doInBackground(Void... params){
            //test Discourse API
            final DiscourseApiClient mDiscourseClient = new DiscourseApiClient(
                    "YourHostName",
                    "YourApiKey",
                    "YourApiKeyUsername"
            );



            String test_username = "TestUsername";
            String test_password = "TestUserPassword";
            ResponseModel responseModel;

            Map<String,String> param = new HashMap<String, String>();
            param.put("login",test_username);
            param.put("password",test_password);
            responseModel = mDiscourseClient.loginUser(param);
            Log.v("DisourseAPI", responseModel.toString());
            return null;
        }
    }
{% endhighlight %}
A more detailed example check [here](https://github.com/wareninja/discourse-api-client/blob/master/src/ExampleUsage.java)

Here is[ my fork ](https://github.com/Naiqus/discourse-api-client)of this project.
