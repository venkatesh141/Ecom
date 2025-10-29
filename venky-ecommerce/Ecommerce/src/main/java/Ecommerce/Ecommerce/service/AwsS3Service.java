package Ecommerce.Ecommerce.service;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;


@Service
@Slf4j
public class AwsS3Service {

    private final String bucketName = "ecomm-venkiyyy";

    @Value("${aws.s3.access}")
    private String awsS3AccessKey;
    @Value("${aws.s3.secrete}")
    private String awsS3SecreteKey;


    public String saveImageToS3(MultipartFile photo){
        try {
            String s3FileName = photo.getOriginalFilename();
            //create aes credentials using the access and secrete key
            BasicAWSCredentials awsCredentials = new BasicAWSCredentials(awsS3AccessKey, awsS3SecreteKey);

            //create an s3 client with config credentials and region
            AmazonS3 s3Client = AmazonS3ClientBuilder.standard()
                    .withCredentials(new AWSStaticCredentialsProvider(awsCredentials))
                    .withRegion(Regions.US_EAST_1)
                    .build();

            //get input stream from photo
            InputStream inputStream = photo.getInputStream();

            //set metedata for the onject
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentType("image/jpg");

            //create a put request to upload the image to s3
            PutObjectRequest putObjectRequest = new PutObjectRequest(bucketName, s3FileName, inputStream, metadata);
            s3Client.putObject(putObjectRequest);

            return "https://" + bucketName + ".s3.us-east-1.amazonaws.com/" + s3FileName;

        }catch (IOException e){
            e.printStackTrace();
            throw new RuntimeException("Unable to upload image to s3 bucket: " + e.getMessage());
        }
    }
}
/*
@Service
@Slf4j
public class AwsS3Service {
@Service → tells Spring that this is a service class (business logic, not a controller or repository).

@Slf4j → adds a logger automatically (so you can do log.info(), log.error(), etc.).

public class AwsS3Service → defines the class.

java
Copy code
    private final String bucketName = "phegon-ecommerce";
This stores your S3 bucket name (where files will be uploaded).

final means it can’t be changed once set.

java
Copy code
    @Value("${aws.s3.access}")
    private String awsS3AccessKey;

    @Value("${aws.s3.secrete}")
    private String awsS3SecreteKey;
These tell Spring to read values from application.properties (or application.yml).
Example in application.properties:

ini
Copy code
aws.s3.access=YOUR_ACCESS_KEY
aws.s3.secrete=YOUR_SECRET_KEY
So you don’t hardcode keys in your Java code (safer, more flexible).

java
Copy code
    public String saveImageToS3(MultipartFile photo){
This method uploads a file (like an image) to S3.

MultipartFile photo is the file you get from an HTTP request (like when someone uploads an image from a form).

java
Copy code
        String s3FileName = photo.getOriginalFilename();
Gets the original file name (e.g., "profile.png") from the uploaded file.

This will be the name used in S3.

java
Copy code
        BasicAWSCredentials awsCredentials = new BasicAWSCredentials(awsS3AccessKey, awsS3SecreteKey);
Creates an AWS credential object using your access key and secret key.

Needed so AWS knows it’s really you uploading.

java
Copy code
        AmazonS3 s3Client = AmazonS3ClientBuilder.standard()
                .withCredentials(new AWSStaticCredentialsProvider(awsCredentials))
                .withRegion(Regions.US_EAST_2)
                .build();
Builds an S3 client object.

.withCredentials(...) → passes your AWS keys.

.withRegion(Regions.US_EAST_2) → tells it which AWS region your bucket is in.

.build() → finishes building the client.

Now s3Client can talk to AWS S3.

java
Copy code
        InputStream inputStream = photo.getInputStream();
Converts the uploaded file (MultipartFile) into an InputStream (so it can be read and uploaded to S3).

java
Copy code
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentType("image/jpeg");
Creates metadata (extra information) about the file.

Here, you’re telling S3 the file type is image/jpeg.

This helps browsers understand the file type when downloading.

java
Copy code
        PutObjectRequest putObjectRequest = new PutObjectRequest(bucketName, s3FileName, inputStream, metadata);
Creates a request object to upload the file.

Needs:

bucketName → where to upload.

s3FileName → what the file will be called in S3.

inputStream → the file data.

metadata → file info (like type).

java
Copy code
        s3Client.putObject(putObjectRequest);
Actually uploads the file to S3. 🎉

java
Copy code
        return "https://" + bucketName + ".s3.us-east-2.amazonaws.com/" + s3FileName;
Returns the public URL of the uploaded file.

Example:

bash
Copy code
https://phegon-ecommerce.s3.us-east-2.amazonaws.com/profile.png
java
Copy code
    }catch (IOException e){
        e.printStackTrace();
        throw new RuntimeException("Unable to upload image to s3 bucket: " + e.getMessage());
    }
If something goes wrong (like file reading issues), this block runs.

Prints error → e.printStackTrace().

Throws a runtime exception with a message.



 */

