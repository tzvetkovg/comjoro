package spring;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.view.InternalResourceViewResolver;
import org.springframework.web.servlet.view.JstlView;

/**
 * Created by joreto on 05/12/2016.
 */
@Configuration
@EnableWebMvc
@ComponentScan(basePackages = "spring")
public class Config {



    @Bean
    public ViewResolver viewResolver() {
        String ab = "fsdsdf";
        InternalResourceViewResolver newResolver = new InternalResourceViewResolver();
        newResolver.setViewClass(JstlView.class);
        newResolver.setPrefix("/WEB-INF/views/");
        newResolver.setSuffix(".jsp");

        return newResolver;
    }


}
