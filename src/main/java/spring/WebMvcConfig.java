package spring;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

/**
 * Created by joreto on 06/12/2016.
 */
@Configuration
class WebMvcConfig extends WebMvcConfigurerAdapter
{

  public void addResourceHandlers(ResourceHandlerRegistry resourceHandlerRegistry)
  {
    resourceHandlerRegistry.addResourceHandler("/resources/**").addResourceLocations("/WEB-INF/resources/");
  }


}
